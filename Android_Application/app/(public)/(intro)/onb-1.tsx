import OnboardingSlide from "@/components/OnboardingSlide";

export const unstable_settings = {
  headerShown: false,
};

export default function Onboarding1() {
  return (
    <OnboardingSlide
      image={require("../../../assets/images/6th.png")}
      headline="Your AI-Powered Path to Better Health"
      body=""
      index={0}
      total={3}
      nextHref="/(intro)/onb-2"
      skipHref="/(public)/sign-up"
    />
  );
}
