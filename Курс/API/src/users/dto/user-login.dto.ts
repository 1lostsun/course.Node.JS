import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email или такой пользователь не сушествует' })
	email: string;

	@IsString({ message: 'Неверно указан пароль' })
	password: string;
}
