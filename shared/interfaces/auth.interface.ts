export interface RegisterRequest{
    email: string;
    password: string;
    name: string;
}

export const validityCheck = (data: RegisterRequest): boolean => {
    const emailChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passChars = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return emailChars.test(data.email) && passChars.test(data.password);
};