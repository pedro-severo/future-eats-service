import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type UserAddressType = {
    id: string;
    city: string;
    complement: string;
    state: string;
    streetNumber: string;
    zone: string;
    streetName: string;
};

export class UserAddress {
    @IsString()
    @IsNotEmpty()
    private id: string;

    @IsString()
    @IsNotEmpty()
    private city: string;

    @IsString()
    @IsOptional()
    complement?: string;

    @IsString()
    @IsNotEmpty()
    private state: string;

    @IsString()
    @IsNotEmpty()
    private streetName: string;

    @IsString()
    @IsNotEmpty()
    private streetNumber: string;

    @IsString()
    @IsNotEmpty()
    private zone: string;

    constructor(
        id: string,
        city: string,
        state: string,
        streetNumber: string,
        zone: string,
        streetName: string,
        complement?: string
    ) {
        this.id = id;
        this.city = city;
        this.complement = complement;
        this.state = state;
        this.streetNumber = streetNumber;
        this.streetName = streetName;
        this.zone = zone;
    }

    public getUserAddress() {
        const { id, city, complement, state, streetNumber, streetName, zone } =
            this;
        return {
            id,
            city,
            complement,
            state,
            streetNumber,
            streetName,
            zone,
        };
    }
}
