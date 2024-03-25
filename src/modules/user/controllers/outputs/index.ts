import { StatusCodes } from 'http-status-codes';

export interface Output<DataResponse> {
    status: StatusCodes;
    data: DataResponse;
}
