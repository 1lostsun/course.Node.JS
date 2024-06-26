import { Response, Router } from 'express';
import { ExpressRetunType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
export { Router } from 'express';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressRetunType {
		res.type('application/json');
		return res.status(200).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressRetunType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressRetunType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((midware) => midware.execute.bind(midware));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
