export const handleError = (error: unknown): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    // For Axios-style error responses
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response: { data?: { message?: string } } };
        return err.response?.data?.message || 'Server error occurred';
    }

    return 'An unexpected error occurred';
};
