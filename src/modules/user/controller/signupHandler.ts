import e, { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from "class-validator";
import { SignupInput } from "./inputs/SignupInput"
import { generateId } from "../../../shared/services/uuid";
import { HashManager } from "../../../shared/services/hash";
import { User } from "../entities/User";
import Container from "typedi";
import { SignupUseCase } from "../useCases/SignupUseCase";
import { AuthenticatorManager } from "../../../shared/services/authentication";

export const signupHandler: RequestHandler = async (req, res) => {
    try {
        const { name, email, cpf, password } = req.body
        const inputToValidate = plainToClass(SignupInput, req.body)
        const errors: ValidationError[] = await validate(inputToValidate)
        if(errors.length) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error validating input",
                errors
            })       
        }
        const id = generateId()
        const hashManager = new HashManager()
        const encryptedPassword = hashManager.hash(password)
        const newUser = new User(id, name, email, encryptedPassword, false, cpf)
        const useCase = Container.get(SignupUseCase)
        const response = await useCase.execute(newUser)
        const authenticator = new AuthenticatorManager()
        const token = authenticator.generateToken({id})        
        return res.status(StatusCodes.CREATED).json({...response, token})       
    } catch (err) {
        if (err.message === "Error: This email is already registered.") {
            return res.status(StatusCodes.CONFLICT).json({ message: err.message })
        }
        res.status(500).json({ message: "Internal Server Error"})    
    }
}