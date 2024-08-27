import FABDStructureCode from './fabd-structure.interface';

interface FABDApiResponse {
	code: string;
	data: any;
	meta?: any;
	message: string;
	errors?: any;
	fabdStructureCode: FABDStructureCode;
}

export default FABDApiResponse;
