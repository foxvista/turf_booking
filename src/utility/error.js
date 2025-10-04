export const handleError = (error) => {
    console.error(error);
    return {
        status: 500,
        message: "Internal Server Error"
    };
}