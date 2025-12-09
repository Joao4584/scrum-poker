export default {
  auth: {
    welcome: "Welcome back",
    integration: {
      description: "Login with your GitHub or Google account",
      login: {
        github: "Login with GitHub",
        google: "Login with Google",
      },
      orContinue: "Or continue with",
    },
    field: {
      password: "Password",
    },
    label: {
      passwordForgot: "Forgot your password?",
    },
  },
  recommended: {
    github: {
      messageFollowUp: "Follow me on my ",
    },
  },
  landing: {
    badge: "Maintenance",
    title: "We are polishing your experience",
    description:
      "Our squad is rolling out improvements to make planning faster and smoother. We will be back online shortly.",
    primaryCta: "Back to home",
    secondaryCta: "See status updates",
  },
  notFound: {
    alertTitle: "Heads up",
    alertMessage: "We could not find the page you were looking for.",
    title: "Page not found",
    description:
      "The content may have been moved or no longer exists. Check the address or head back to the main page.",
    backHome: "Return to home",
    tryAgain: "Try again",
  },
  dashboard: {
    menu: {
      overview: "Overview",
      projects: "Projects",
    },
  },
} as const;
