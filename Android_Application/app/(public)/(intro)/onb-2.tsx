import OnboardingSlide from "@/components/OnboardingSlide";

export default function Onboarding2() {
  return (
    <OnboardingSlide
      image={require("../../../assets/images/7th.png")}
      headline="SymptoScan - Scan your symptoms and get a personalized health report."
      index={1}
      total={3}
      nextHref="/(intro)/onb-3"
      skipHref="/(auth)/sign-up"
    />
  );
}
