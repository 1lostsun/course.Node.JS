import 'reflect-metadata';
import { Container } from 'inversify';
import { IUserService } from '../users.interface';
import { IUserRepository } from '../users.repository.interface';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { UserServise } from '../users.service';
import { User } from '../user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let userService: IUserService;
let userRepository: IUserRepository;
let configService: IConfigService;

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserServise).to(UserServise);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserServise);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce((user: User) => ({
			name: user.name,
			email: user.email,
			password: user.password,
			id: 1,
		}));
		createdUser = await userService.createUser({
			name: 'Rupert',
			email: 'aaa@a.ru',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'aaa@a.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});
	it('validateUser - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'aaa@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
	it('validateUser - wrong user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({
			email: 'a1aa@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
