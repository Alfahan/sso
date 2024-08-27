import { BaseEntity } from '@app/entities/base.entity';

describe('BaseEntity', () => {
	// Tests that a BaseEntity instance can be created successfully
	it('should create a new BaseEntity instance', () => {
		const baseEntity = new BaseEntity();
		expect(baseEntity).toBeInstanceOf(BaseEntity);
	});

	// Tests that all default values are set correctly
	it('should set default values correctly', () => {
		const baseEntity = new BaseEntity();
		baseEntity.created_by = '1';
		baseEntity.created_name = 'System';
		expect(baseEntity.created_by).toBe('1');
		expect(baseEntity.created_name).toBe('System');
	});
});
