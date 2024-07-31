export enum USER_ERROR_MESSAGES {
    NOT_FOUND = 'User not found',
    ADDRESS_NOT_FOUND = 'Address not found to this user',
    USER_WITHOUT_ADDRESS = "This user doesn't have address registered",
    INCORRECT_PASSWORD = 'Incorrect password',
    EMAIL_ALREADY_REGISTERED = 'This email is already registered',
    FAILED_TO_REGISTER_ADDRESS = 'Failed to register address',
    UNAUTHORIZED_ERROR = 'There is not valid authentication credentials for the target resource',
    AUTHORIZATION_CHECKING_ERROR = 'It was not possible to check user authorization',
}
