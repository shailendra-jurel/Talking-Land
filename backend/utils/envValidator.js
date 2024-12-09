export const validateEnvironment = () => {
    const requiredEnvVars = [
      'NODE_ENV',
      'PORT',
      'ALLOWED_ORIGINS',
      // Add other required environment variables here
    ];
  
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }
  };