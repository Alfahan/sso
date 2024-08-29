import { BaseDTO } from '@app/dto/base.dto';

export class CreateTodoV10 extends BaseDTO {
	title: string;
	completed: boolean;
}
