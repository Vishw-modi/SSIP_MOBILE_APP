import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as base64 from "base64-js"
import type { AnalysisResult } from "./Step4" // Keep your existing import path

type Fonts = {
  regular: any
  bold: any
}

type ReportContext = {
  pdf: PDFDocument
  page: any
  pageIndex: number
  y: number
  fonts: Fonts
  brand: {
    primary: { r: number; g: number; b: number }
    text: { r: number; g: number; b: number }
    subtle: { r: number; g: number; b: number }
    danger: { r: number; g: number; b: number }
    success: { r: number; g: number; b: number }
    warning: { r: number; g: number; b: number }
  }
  size: { width: number; height: number }
  margin: { x: number; top: number; bottom: number }
}

const A4 = { width: 595, height: 842 }
const MARGIN_X = 50
const CONTENT_TOP_OFFSET = 120 // distance from top to begin content (keeps below header)
const BOTTOM = 70

function toRgb(c: { r: number; g: number; b: number }) {
  return rgb(c.r, c.g, c.b)
}

function makeBrand() {
  return {
    // A restrained medical palette
    primary: { r: 0.1, g: 0.32, b: 0.7 }, // blue
    text: { r: 0.12, g: 0.12, b: 0.12 }, // near-black
    subtle: { r: 0.78, g: 0.8, b: 0.84 }, // cool gray
    danger: { r: 0.8, g: 0.1, b: 0.1 }, // red
    success: { r: 0.08, g: 0.55, b: 0.16 }, // green
    warning: { r: 0.9, g: 0.6, b: 0.0 }, // amber
  }
}

function urgencyColor(ctx: ReportContext, urgency: AnalysisResult["urgency"]) {
  if (urgency === "High") return toRgb(ctx.brand.danger)
  if (urgency === "Moderate") return toRgb(ctx.brand.warning)
  return toRgb(ctx.brand.success)
}

function widthOf(text: string, font: any, size: number) {
  return font.widthOfTextAtSize(text, size)
}

function ensureSpace(ctx: ReportContext, needed: number) {
  if (ctx.y - needed < ctx.margin.bottom) {
    newPage(ctx)
  }
}

function newPage(ctx: ReportContext) {
  ctx.page = ctx.pdf.addPage([ctx.size.width, ctx.size.height])
  ctx.pageIndex += 1
  drawHeader(ctx)
  drawFooter(ctx)
  ctx.y = contentTop(ctx) // always reset to safe area below header
}

function contentTop(ctx: ReportContext) {
  return ctx.size.height - CONTENT_TOP_OFFSET
}

function drawHeader(ctx: ReportContext) {
  const { page, fonts, brand } = ctx
  // Top divider
  page.drawRectangle({
    x: 0,
    y: ctx.size.height - 6,
    width: ctx.size.width,
    height: 6,
    color: toRgb(brand.primary),
  })

  // Logo placeholder (left)
  page.drawRectangle({
    x: ctx.margin.x,
    y: ctx.size.height - 60,
    width: 36,
    height: 36,
    color: toRgb(brand.primary),
    opacity: 0.12,
  })
  page.drawText("HealthyLife Medical Center", {
    x: ctx.margin.x + 48,
    y: ctx.size.height - 38,
    size: 16,
    font: fonts.bold,
    color: toRgb(brand.primary),
  })
  page.drawText("Excellence in Preventive & Personalized Care", {
    x: ctx.margin.x + 48,
    y: ctx.size.height - 58,
    size: 10,
    font: fonts.regular,
    color: rgb(0.35, 0.35, 0.38),
  })

  // Clinic contact (right)
  const rightX = ctx.size.width - ctx.margin.x - 220
  page.drawText("contact@healthylife.example | +1 (555) 123-4567", {
    x: rightX,
    y: ctx.size.height - 38,
    size: 10,
    font: fonts.regular,
    color: rgb(0.35, 0.35, 0.38),
  })
  page.drawText("123 Wellness Ave, Suite 4B, Care City, CA", {
    x: rightX,
    y: ctx.size.height - 58,
    size: 10,
    font: fonts.regular,
    color: rgb(0.35, 0.35, 0.38),
  })

  // Watermark (subtle)
  page.drawText("CONFIDENTIAL", {
    x: ctx.size.width / 2 - 150,
    y: ctx.size.height / 2,
    size: 40,
    font: fonts.bold,
    rotate: degrees(30),
    color: toRgb(ctx.brand.subtle),
    opacity: 0.12,
  })

  // NOTE: intentionally not setting ctx.y here to avoid pushing content into header area
}

function drawFooter(ctx: ReportContext) {
  const { page, fonts, brand } = ctx
  // Bottom divider
  page.drawRectangle({
    x: 0,
    y: 40,
    width: ctx.size.width,
    height: 1,
    color: rgb(0.85, 0.86, 0.88),
  })
  // Page number
  const text = `Page ${ctx.pageIndex}`
  page.drawText(text, {
    x: ctx.size.width - ctx.margin.x - widthOf(text, fonts.regular, 10),
    y: 20,
    size: 10,
    font: fonts.regular,
    color: rgb(0.45, 0.46, 0.48),
  })
  // Mini disclaimer footer note
  page.drawText("AI-assisted draft — review with a licensed clinician before making health decisions.", {
    x: ctx.margin.x,
    y: 20,
    size: 9,
    font: fonts.regular,
    color: rgb(0.45, 0.46, 0.48),
  })
}

function drawTitle(ctx: ReportContext, patientName: string) {
  const { page, fonts, brand } = ctx
  // Make sure there is a little extra room for the title block
  ensureSpace(ctx, 90)
  ctx.y -= 10
  page.drawText("Medical Health Report", {
    x: ctx.margin.x,
    y: ctx.y,
    size: 22,
    font: fonts.bold,
    color: toRgb(brand.text),
  })
  ctx.y -= 24
  page.drawText(`Patient: ${patientName}`, {
    x: ctx.margin.x,
    y: ctx.y,
    size: 12,
    font: fonts.regular,
    color: toRgb(brand.text),
  })
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: ctx.size.width - ctx.margin.x - 160,
    y: ctx.y,
    size: 12,
    font: fonts.regular,
    color: toRgb(brand.text),
  })
  ctx.y -= 16
  page.drawRectangle({
    x: ctx.margin.x,
    y: ctx.y,
    width: ctx.size.width - ctx.margin.x * 2,
    height: 1,
    color: rgb(0.85, 0.86, 0.88),
  })
}

function drawUrgencyAndScore(ctx: ReportContext, urgency: AnalysisResult["urgency"], score: number) {
  const { page, fonts } = ctx
  ensureSpace(ctx, 60)
  ctx.y -= 20

  // Urgency Pill
  const pillText = `Urgency: ${urgency}`
  const pillPaddingX = 10
  const pillPaddingY = 6
  const pillSize = 12
  const pillTextW = widthOf(pillText, fonts.bold, pillSize)
  page.drawRectangle({
    x: ctx.margin.x,
    y: ctx.y - pillPaddingY,
    width: pillTextW + pillPaddingX * 2,
    height: pillSize + pillPaddingY * 2,
    color: urgencyColor(ctx, urgency),
    opacity: 0.12,
    borderColor: urgencyColor(ctx, urgency),
    borderWidth: 1,
  })
  page.drawText(pillText, {
    x: ctx.margin.x + pillPaddingX,
    y: ctx.y,
    size: pillSize,
    font: fonts.bold,
    color: urgencyColor(ctx, urgency),
  })

  // Health Score Bar
  const barWidth = 260
  const barHeight = 12
  const barX = ctx.size.width - ctx.margin.x - barWidth
  const barY = ctx.y + 2
  page.drawText("Personalized Health Score", {
    x: barX,
    y: ctx.y + 18,
    size: 10,
    font: fonts.bold,
    color: rgb(0.35, 0.36, 0.38),
  })
  page.drawRectangle({
    x: barX,
    y: barY,
    width: barWidth,
    height: barHeight,
    color: rgb(0.92, 0.93, 0.95),
  })
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  page.drawRectangle({
    x: barX,
    y: barY,
    width: (barWidth * clamped) / 100,
    height: barHeight,
    color:
      clamped >= 70 ? toRgb(ctx.brand.success) : clamped >= 40 ? toRgb(ctx.brand.warning) : toRgb(ctx.brand.danger),
  })
  const scoreLabel = `${clamped}/100`
  page.drawText(scoreLabel, {
    x: barX + barWidth + 8,
    y: ctx.y + 2,
    size: 12,
    font: fonts.bold,
    color: toRgb(ctx.brand.text),
  })

  ctx.y -= 34
}

function drawSectionHeader(ctx: ReportContext, title: string) {
  const { page, fonts, brand } = ctx
  ensureSpace(ctx, 32)
  ctx.y -= 12
  // Title rule and label
  page.drawRectangle({
    x: ctx.margin.x,
    y: ctx.y + 10,
    width: ctx.size.width - ctx.margin.x * 2,
    height: 1,
    color: rgb(0.85, 0.86, 0.88),
  })
  page.drawText(title, {
    x: ctx.margin.x,
    y: ctx.y,
    size: 14,
    font: fonts.bold,
    color: toRgb(ctx.brand.primary),
  })
  ctx.y -= 8
}

function wrapLines(text: string, maxWidth: number, font: any, size: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const tentative = current ? current + " " + word : word
    if (widthOf(tentative, font, size) <= maxWidth) {
      current = tentative
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawParagraph(
  ctx: ReportContext,
  text: string,
  options?: { size?: number; leading?: number; indent?: number; color?: any },
) {
  const { page, fonts } = ctx
  const size = options?.size ?? 12
  const leading = options?.leading ?? 16
  const indent = options?.indent ?? 0
  const color = options?.color ?? toRgb(ctx.brand.text)
  const maxW = ctx.size.width - ctx.margin.x * 2 - indent
  const lines = wrapLines(text, maxW, fonts.regular, size)
  for (const line of lines) {
    ensureSpace(ctx, leading)
    page.drawText(line, {
      x: ctx.margin.x + indent,
      y: ctx.y,
      size,
      font: fonts.regular,
      color,
    })
    ctx.y -= leading
  }
}

function drawBulletList(ctx: ReportContext, items: string[], options?: { size?: number; leading?: number }) {
  const size = options?.size ?? 12
  const leading = options?.leading ?? 16
  for (const item of items) {
    const lines = wrapLines(item, ctx.size.width - ctx.margin.x * 2 - 16, ctx.fonts.regular, size)
    ensureSpace(ctx, leading)
    ctx.page.drawText("•", {
      x: ctx.margin.x,
      y: ctx.y,
      size,
      font: ctx.fonts.bold,
      color: toRgb(ctx.brand.text),
    })
    // first line
    ctx.page.drawText(lines[0], {
      x: ctx.margin.x + 16,
      y: ctx.y,
      size,
      font: ctx.fonts.regular,
      color: toRgb(ctx.brand.text),
    })
    ctx.y -= leading
    // wrapped lines
    for (let i = 1; i < lines.length; i++) {
      ensureSpace(ctx, leading)
      ctx.page.drawText(lines[i], {
        x: ctx.margin.x + 16,
        y: ctx.y,
        size,
        font: ctx.fonts.regular,
        color: toRgb(ctx.brand.text),
      })
      ctx.y -= leading
    }
  }
}

function drawKeyValue(ctx: ReportContext, key: string, value: string) {
  const label = `${key}: `
  const labelW = widthOf(label, ctx.fonts.bold, 12)
  ensureSpace(ctx, 16)
  ctx.page.drawText(label, {
    x: ctx.margin.x,
    y: ctx.y,
    size: 12,
    font: ctx.fonts.bold,
    color: toRgb(ctx.brand.text),
  })
  const lines = wrapLines(value, ctx.size.width - ctx.margin.x * 2 - labelW, ctx.fonts.regular, 12)
  if (lines.length) {
    ctx.page.drawText(lines[0], {
      x: ctx.margin.x + labelW,
      y: ctx.y,
      size: 12,
      font: ctx.fonts.regular,
      color: toRgb(ctx.brand.text),
    })
    ctx.y -= 16
    for (let i = 1; i < lines.length; i++) {
      ensureSpace(ctx, 16)
      ctx.page.drawText(lines[i], {
        x: ctx.margin.x + labelW,
        y: ctx.y,
        size: 12,
        font: ctx.fonts.regular,
        color: toRgb(ctx.brand.text),
      })
      ctx.y -= 16
    }
  }
}

function parseNumber(n?: string | number | null) {
  if (n === null || n === undefined) return Number.NaN
  const v = typeof n === "string" ? n.trim() : String(n)
  const f = Number.parseFloat(v)
  return Number.isFinite(f) ? f : Number.NaN
}

function computeBMI(heightCm?: string | number, weightKg?: string | number) {
  const hCm = parseNumber(heightCm)
  const wKg = parseNumber(weightKg)
  if (!Number.isFinite(hCm) || !Number.isFinite(wKg) || hCm <= 0 || wKg <= 0) return null
  const hM = hCm / 100
  const bmi = wKg / (hM * hM)
  let category = "Normal"
  if (bmi < 18.5) category = "Underweight"
  else if (bmi < 25) category = "Normal"
  else if (bmi < 30) category = "Overweight"
  else category = "Obesity"
  return { bmi: Math.round(bmi * 10) / 10, category }
}

function drawVitals(ctx: ReportContext, vitals?: { heightCm?: string | number; weightKg?: string | number }) {
  if (!vitals) return
  const height = parseNumber(vitals.heightCm)
  const weight = parseNumber(vitals.weightKg)
  if (!Number.isFinite(height) && !Number.isFinite(weight)) return

  drawSectionHeader(ctx, "Vitals")

  if (Number.isFinite(height)) {
    drawKeyValue(ctx, "Height", `${height} cm`)
  }
  if (Number.isFinite(weight)) {
    drawKeyValue(ctx, "Weight", `${weight} kg`)
  }

  const bmi = computeBMI(vitals.heightCm, vitals.weightKg)
  if (bmi) {
    drawKeyValue(ctx, "BMI", `${bmi.bmi} (${bmi.category})`)
  }
}

function drawBoxedNote(
  ctx: ReportContext,
  text: string,
  opts?: {
    size?: number
    leading?: number
    padding?: number
    bg?: { r: number; g: number; b: number }
    border?: { r: number; g: number; b: number }
    color?: { r: number; g: number; b: number }
  },
) {
  const size = opts?.size ?? 10
  const leading = opts?.leading ?? 14
  const padding = opts?.padding ?? 10
  const bg = opts?.bg ?? { r: 1, g: 0.98, b: 0.98 }
  const border = opts?.border ?? { r: 0.92, g: 0.8, b: 0.8 }
  const color = opts?.color ?? { r: 0.6, g: 0.1, b: 0.1 }

  const maxW = ctx.size.width - ctx.margin.x * 2 - padding * 2
  const lines = wrapLines(text, maxW, ctx.fonts.regular, size)
  const contentHeight = lines.length * leading
  const boxHeight = contentHeight + padding * 2

  // Ensure space; if not, new page first
  if (ctx.y - boxHeight < ctx.margin.bottom) {
    newPage(ctx)
  }

  const boxY = ctx.y - boxHeight
  ctx.page.drawRectangle({
    x: ctx.margin.x,
    y: boxY,
    width: ctx.size.width - ctx.margin.x * 2,
    height: boxHeight,
    color: rgb(bg.r, bg.g, bg.b),
    opacity: 1,
    borderColor: rgb(border.r, border.g, border.b),
    borderWidth: 1,
  })

  // Draw text lines inside box
  let textY = ctx.y - padding - (leading - size) // optical baseline
  for (const line of lines) {
    ctx.page.drawText(line, {
      x: ctx.margin.x + padding,
      y: textY,
      size,
      font: ctx.fonts.regular,
      color: rgb(color.r, color.g, color.b),
    })
    textY -= leading
  }

  ctx.y = boxY - 12 // space after the box
}

function drawDietTable(ctx: ReportContext, diet: AnalysisResult["dietRecommendations"]) {
  drawSectionHeader(ctx, "Nutrition Plan")
  const x = ctx.margin.x
  const tableW = ctx.size.width - ctx.margin.x * 2
  const col1W = 110
  const lineLeading = 14
  const minRowH = 36
  const rowPad = 10

  const rows: Array<[string, string]> = [
    ["Breakfast", (diet?.breakfast ?? []).join(", ") || "-"],
    ["Lunch", (diet?.lunch ?? []).join(", ") || "-"],
    ["Dinner", (diet?.dinner ?? []).join(", ") || "-"],
    ["Snacks", (diet?.snacks ?? []).join(", ") || "-"],
  ]

  for (const [label, value] of rows) {
    const textX = x + col1W + rowPad
    const maxW = tableW - col1W - rowPad * 2
    const lines = wrapLines(value, maxW, ctx.fonts.regular, 12)
    const textBlockH = Math.max(lineLeading, lines.length * lineLeading)
    const rowH = Math.max(minRowH, textBlockH + rowPad * 2)

    // Manual page check to redraw section header on next page
    if (ctx.y - (rowH + 8) < ctx.margin.bottom) {
      newPage(ctx)
      drawSectionHeader(ctx, "Nutrition Plan")
    }

    // Row background
    ctx.page.drawRectangle({
      x,
      y: ctx.y - rowH,
      width: tableW,
      height: rowH,
      color: rgb(0.97, 0.98, 0.99),
    })

    // Vertical separator
    ctx.page.drawRectangle({
      x: x + col1W,
      y: ctx.y - rowH,
      width: 1,
      height: rowH,
      color: rgb(0.85, 0.86, 0.88),
    })

    // Label
    ctx.page.drawText(label, {
      x: x + rowPad,
      y: ctx.y - rowPad - (lineLeading - 12),
      size: 12,
      font: ctx.fonts.bold,
      color: toRgb(ctx.brand.primary),
    })

    // Value lines
    let textY = ctx.y - rowPad - (lineLeading - 12)
    for (let i = 0; i < lines.length; i++) {
      ctx.page.drawText(lines[i], {
        x: textX,
        y: textY,
        size: 12,
        font: ctx.fonts.regular,
        color: toRgb(ctx.brand.text),
      })
      textY -= lineLeading
    }

    ctx.y -= rowH + 8
  }
}

function drawSignature(ctx: ReportContext) {
  ensureSpace(ctx, 80)
  ctx.y -= 6
  ctx.page.drawText("Prepared by:", {
    x: ctx.margin.x,
    y: ctx.y,
    size: 12,
    font: ctx.fonts.bold,
    color: rgb(0.35, 0.36, 0.38),
  })
  ctx.y -= 28
  // Signature line
  ctx.page.drawRectangle({
    x: ctx.margin.x,
    y: ctx.y + 10,
    width: 220,
    height: 1,
    color: rgb(0.65, 0.66, 0.68),
  })
  ctx.page.drawText("Automated Clinical Assistant", {
    x: ctx.margin.x,
    y: ctx.y - 6,
    size: 12,
    font: ctx.fonts.regular,
    color: rgb(0.35, 0.36, 0.38),
  })
  // Verification note
  const note = "This report was generated using AI assistance and should be reviewed by a licensed clinician."
  ctx.y -= 28
  drawParagraph(ctx, note, { size: 10, leading: 14, color: rgb(0.45, 0.46, 0.48) })
}

export const handleDownloadReport = async (
  analysisResult: AnalysisResult,
  patientName = "John Doe",
  vitals?: { heightCm?: string | number; weightKg?: string | number },
) => {
  try {
    const pdf = await PDFDocument.create()
    const fonts: Fonts = {
      regular: await pdf.embedFont(StandardFonts.Helvetica),
      bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    }

    const ctx: ReportContext = {
      pdf,
      page: pdf.addPage([A4.width, A4.height]),
      pageIndex: 1,
      y: 0, // init to 0, will set after header/footer
      fonts,
      brand: makeBrand(),
      size: A4,
      margin: { x: MARGIN_X, top: 0, bottom: BOTTOM }, // top will be set after header
    }

    // Initial header/footer
    drawHeader(ctx)
    drawFooter(ctx)
    ctx.y = contentTop(ctx) // start body safely below header
    ctx.margin.top = ctx.y // store for reference (not strictly required)

    // Title + Meta
    drawTitle(ctx, patientName)
    drawUrgencyAndScore(ctx, analysisResult.urgency, analysisResult.personalizedHealthScore)

    drawVitals(ctx, vitals)

    // Summary
    drawSectionHeader(ctx, "Clinical Summary")
    if (Array.isArray(analysisResult.summary) && analysisResult.summary.length) {
      for (const line of analysisResult.summary) {
        drawParagraph(ctx, line)
      }
    } else {
      drawParagraph(ctx, analysisResult.advice || "Summary not provided.")
    }

    // Conditions & Diseases
    drawSectionHeader(ctx, "Possible Conditions")
    const uniqConditions = Array.from(
      new Set([...(analysisResult.possibleConditions || []), ...(analysisResult.possibleDiseases || [])]),
    ).filter(Boolean)
    if (uniqConditions.length) {
      drawBulletList(ctx, uniqConditions)
    } else {
      drawParagraph(ctx, "No specific conditions were inferred.")
    }

    // Risk Factors
    if (analysisResult.riskFactors?.length) {
      drawSectionHeader(ctx, "Risk Factors")
      drawBulletList(ctx, analysisResult.riskFactors)
    }

    // Preventive Measures
    if (analysisResult.preventiveMeasures?.length) {
      drawSectionHeader(ctx, "Preventive Measures")
      drawBulletList(ctx, analysisResult.preventiveMeasures)
    }

    // Recommended Next Steps
    if (analysisResult.recommendedNextSteps?.length) {
      drawSectionHeader(ctx, "Recommended Next Steps")
      drawBulletList(ctx, analysisResult.recommendedNextSteps)
    }

    // Do / Don't
    if (analysisResult.doList?.length || analysisResult.dontList?.length) {
      drawSectionHeader(ctx, "Care Plan Guidance")
      if (analysisResult.doList?.length) {
        drawKeyValue(ctx, "Do", analysisResult.doList.join("; "))
      }
      if (analysisResult.dontList?.length) {
        drawKeyValue(ctx, "Don't", analysisResult.dontList.join("; "))
      }
    }

    // Follow-up Actions
    if (analysisResult.followUpActions?.length) {
      drawSectionHeader(ctx, "Follow-up Actions")
      drawBulletList(ctx, analysisResult.followUpActions)
    }

    // Diet Table
    if (analysisResult.dietRecommendations) {
      drawDietTable(ctx, analysisResult.dietRecommendations)
    }

    // Exercise Plan
    if (analysisResult.exercisePlan?.length) {
      drawSectionHeader(ctx, "Exercise Plan")
      drawBulletList(ctx, analysisResult.exercisePlan)
    }

    // Ayurvedic Medications
    if (analysisResult.ayurvedicMedications?.length) {
      drawSectionHeader(ctx, "Ayurvedic Medications")
      drawBulletList(ctx, analysisResult.ayurvedicMedications)
    }

    // Insights
    if (analysisResult.reportInsights?.length) {
      drawSectionHeader(ctx, "Clinical Insights")
      drawBulletList(ctx, analysisResult.reportInsights)
    }

    // Signature & Final Disclaimer
    drawSignature(ctx)

    const disclaimer =
      "Disclaimer: This report is generated with AI assistance and is intended for informational purposes only. It is not a medical diagnosis. Always consult a licensed physician for professional advice, diagnosis, or treatment."
    drawBoxedNote(ctx, disclaimer, {
      size: 10,
      leading: 14,
      padding: 10,
      bg: { r: 1, g: 0.98, b: 0.98 },
      border: { r: 0.92, g: 0.8, b: 0.8 },
      color: { r: 0.6, g: 0.1, b: 0.1 },
    })

    // Save & Share
    const pdfBytes = await pdf.save()
    const base64Data = base64.fromByteArray(pdfBytes)
    const fileUri = FileSystem.documentDirectory + "HealthyLife_Medical_Report.pdf"
    await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 })
    await Sharing.shareAsync(fileUri)
    console.log("✅ PDF generated and shared:", fileUri)
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
  }
}
