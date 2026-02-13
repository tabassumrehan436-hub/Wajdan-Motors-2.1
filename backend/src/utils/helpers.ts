export const formatResponse = (success: boolean, message: string, data?: any, meta?: any) => {
  return {
    success,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  };
};

export const calculatePagination = (page: number = 1, limit: number = 20) => {
  const skip = (Math.max(1, page) - 1) * limit;
  return { skip, limit };
};

export const truncateString = (str: string, length: number) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
