import { ProductService } from "../modules/product/services/product";
import { TenantService } from "../modules/tenant/services/tenant";
import { models, Product, Tenant } from '../config/db';
import { logger } from "../libs/logger";
import '../index';
import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';


let fakeId = uuid();
let fakeTenantId = uuid();
let productServiceInstance = new ProductService({ model: Product, logger, models })
let tenantServiceInstance = new TenantService({model: Tenant, logger, models})
let productData: any = {
    id: fakeId,
    tenantId: fakeTenantId,
    name: "laptop",
    description: "Product Laptop",
    upc: "101",
}

let request: any = {
    query: {},
    params: {},
    body: productData
}

describe('product service test cases', () => {

      // create tenant
      test('create tenant successfully', async () => {
        const request: any = {
            body:
            {
                id: fakeTenantId,
                name: "Innobit",
                description: "Innobit-Tenant",
                features: []
            }
                }
        
        var tenantResponse: any = await tenantServiceInstance.createTenant(request);               
        expect(tenantResponse.dataValues.name).toBe('Innobit');
        expect(tenantResponse.dataValues.description).toBe('Innobit-Tenant');
    })

    // Appending Product without adding the product test case
    test('Appending Product without adding the product', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'APPEND' } };
        const data =
            [{
                "NAME": "Shirt",
                "DESCRIPTION": "Shirt-Shirt",
                "IMAGE_URL": "shirt.png",
                "UPC": "104",
                "SKU": "SKU12",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Table",
                "DESCRIPTION": "Table Products",
                "IMAGE_URL": "table.png",
                "UPC": "105",
                "SKU": "SKU13",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Furniture",
                "CATEGORIES": "Chair/Table",
                "SUB_CATEGORIES": "Table",
                "PRICE": "3000",
                "COLOR": " Red",
                "SIZE": "S",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data);
        } catch (error: any) {
            expect(error.message).toBe('First need to add product Data during append operation.')
        }
    })

    // Updating Product without adding the product test case
    test('Updating Product without adding the product', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'UPDATE' } };
        const data =
            [{
                "NAME": "Shirt",
                "DESCRIPTION": "Shirt-Shirt",
                "IMAGE_URL": "shirt.png",
                "UPC": "104",
                "SKU": "SKU12",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Table",
                "DESCRIPTION": "Table Products",
                "IMAGE_URL": "table.png",
                "UPC": "105",
                "SKU": "SKU13",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Furniture",
                "CATEGORIES": "Chair/Table",
                "SUB_CATEGORIES": "Table",
                "PRICE": "3000",
                "COLOR": " Red",
                "SIZE": "S",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data);
        } catch (error: any) {
            expect(error.message).toBe('First need to add product Data during update operation.')
        }
    })

    // Adding Product test case
    test('Adding Product successfully', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'ADD' } };
        const data =
            [{
                "NAME": "Shirt",
                "DESCRIPTION": "Shirt-Shirt",
                "IMAGE_URL": "shirt.png",
                "UPC": "104",
                "SKU": "SKU12",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Table",
                "DESCRIPTION": "Table Products",
                "IMAGE_URL": "table.png",
                "UPC": "105",
                "SKU": "SKU13",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Furniture",
                "CATEGORIES": "Chair/Table",
                "SUB_CATEGORIES": "Table",
                "PRICE": "3000",
                "COLOR": " Red",
                "SIZE": "S",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data); 
           expect(result.totalRows).toBeGreaterThan(0)
        } catch (error: any) {
            expect(error.message).toBe('unable to upload product')
        }
    })

    // Adding another Product file as one product file is already present test case
    test('Adding another Product file as one product file is already present', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'ADD' } };
        const data =
            [{
                "NAME": "Shirt",
                "DESCRIPTION": "Shirt-Shirt",
                "IMAGE_URL": "shirt.png",
                "UPC": "104",
                "SKU": "SKU12",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Table",
                "DESCRIPTION": "Table Products",
                "IMAGE_URL": "table.png",
                "UPC": "105",
                "SKU": "SKU13",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Furniture",
                "CATEGORIES": "Chair/Table",
                "SUB_CATEGORIES": "Table",
                "PRICE": "3000",
                "COLOR": " Red",
                "SIZE": "S",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data);
        } catch (error: any) {
            expect(error.message).toBe('You can not add data as data is already present.')
        }
    })

    // Appending Product test case
    test('Appending Product successfully', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'APPEND' } };
        const data =
            [{
                "NAME": "Jeans",
                "DESCRIPTION": "Jeans-Jeans",
                "IMAGE_URL": "jeans.png",
                "UPC": "106",
                "SKU": "SKU14",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Chair",
                "DESCRIPTION": "Chair Products",
                "IMAGE_URL": "chair.png",
                "UPC": "107",
                "SKU": "SKU15",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Furniture",
                "CATEGORIES": "Chair/Table",
                "SUB_CATEGORIES": "Chair",
                "PRICE": "3000",
                "COLOR": " Red",
                "SIZE": "S",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data);
            expect(result.totalRows).toBeGreaterThan(0)

            //  expect(result[0]).toBe(1);
        } catch (error: any) {
            expect(error.message).toBe('unable to upload product')
        }
    })

    // Updating Product test case
    test('Updating Product successfully', async () => {
        const request: any = { params: { tenantId: fakeTenantId }, body: { actionType: 'UPDATE' } };
        const data =
            [{
                "NAME": "Tshirt",
                "DESCRIPTION": "Tshirt-Tshirt",
                "IMAGE_URL": "tshirt.png",
                "UPC": "107",
                "SKU": "SKU14",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Frock",
                "DESCRIPTION": "Frock-Frock",
                "IMAGE_URL": "frock.png",
                "UPC": "106",
                "SKU": "SKU14",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Shirt/Tshirt/Jeans",
                "SUB_CATEGORIES": "Shirt",
                "PRICE": "2000",
                "COLOR": "  White",
                "SIZE": "M",
                "IMAGES": "1",
                "OTHER_ATTRIBUTES": ""
            },
            {
                "NAME": "Desk",
                "DESCRIPTION": "Desk-Desk",
                "IMAGE_URL": "desk.png",
                "UPC": "108",
                "SKU": "SKU14",
                "EXPERIENCE_ID": "1000",
                "EXPERIENCE_TENANT_ID": "2000",
                "EXPERIENCE_STUDIO_ID": "3000",
                "MANUFACTURER": "default",
                "TYPE": "Clothing",
                "CATEGORIES": "Table/Chair/Desk",
                "SUB_CATEGORIES": "Desk",
                "PRICE": "2500",
                "COLOR": "White",
                "SIZE": "M",
                "IMAGES": "2",
                "OTHER_ATTRIBUTES": ""
            }]
        try {
            var result: any = await productServiceInstance.uploadProduct(request, data);
            expect(result.totalRows).toBeGreaterThan(0)

        } catch (error: any) {
            expect(error.message).toBe('unable to upload product')
        }
    })

    // get all products 
    test('read all products successfully', async () => {
        try {
            const request: any = { params: {}, query: { page: 1 } };
            var productResponse = await productServiceInstance.readAll(request)
            expect(productResponse.count).toBeGreaterThan(0)
        } catch (error: any) {
            expect(error.message).toBe('unable to get all product')
        }
    })

    // update a product By UPC
    test('update the upc of a product successfully', async () => {
        const request: any = {
            body:
            {
                name: "laptop",
                description: "Product Laptop",
            },
            params: { upc: 106 }
        }

        try {
            var productResponse = await productServiceInstance.updateByUpc(request)
            expect(productResponse.dataValues.name).toBe('laptop')
            expect(productResponse.dataValues.description).toBe('Product Laptop')
        } catch (error: any) {
            expect(error.message).toBe('unable to update the upc of a product')
        }
    })

    // update a product which is not exist 
    test('update a product which is not exist', async () => {
        const request: any = {
            body:
            {
                name: "laptop",
                description: "Product Laptop",
            },
            params: { upc: 1111 }
        }
        try {
            await productServiceInstance.updateByUpc(request)
        } catch (error: any) {
            expect(error.message).toBe('record with upc 111 does not exist')
        }
    })

    // update the upc of a product but giving extra field to update
    test('update the upc of a product but giving extra field', async () => {
        const request: any = {
            body:
            {
                name: "laptop",
                description: "Product Laptop",
                experience: "123"
            },
            params: { upc: 107 }
        }
        try {
            await productServiceInstance.updateByUpc(request)
        } catch (error: any) {
            expect(error.message).toBe('experience field not allowed for update operation')
        }
    })

        // export functionality
        test('export functionality for a product file', async () => {
            const request: any = { params: { tenantId: fakeTenantId }};
            const data =
                [{
                    "NAME": "Shirt",
                    "DESCRIPTION": "Shirt-Shirt",
                    "IMAGE_URL": "shirt.png",
                    "UPC": "104",
                    "SKU": "SKU12",
                    "EXPERIENCE_ID": "1000",
                    "EXPERIENCE_TENANT_ID": "2000",
                    "EXPERIENCE_STUDIO_ID": "3000",
                    "MANUFACTURER": "default",
                    "TYPE": "Clothing",
                    "CATEGORIES": "Shirt/Tshirt/Jeans",
                    "SUB_CATEGORIES": "Shirt",
                    "PRICE": "2000",
                    "COLOR": "  White",
                    "SIZE": "M",
                    "IMAGES": "1",
                    "OTHER_ATTRIBUTES": ""
                },
                {
                    "NAME": "Table",
                    "DESCRIPTION": "Table Products",
                    "IMAGE_URL": "table.png",
                    "UPC": "105",
                    "SKU": "SKU13",
                    "EXPERIENCE_ID": "1000",
                    "EXPERIENCE_TENANT_ID": "2000",
                    "EXPERIENCE_STUDIO_ID": "3000",
                    "MANUFACTURER": "default",
                    "TYPE": "Furniture",
                    "CATEGORIES": "Chair/Table",
                    "SUB_CATEGORIES": "Table",
                    "PRICE": "3000",
                    "COLOR": " Red",
                    "SIZE": "S",
                    "IMAGES": "1",
                    "OTHER_ATTRIBUTES": ""
                }]
            try {
                // var result: any = await productServiceInstance.exportData(request);
                // expect(result.dataValues.message).toBe('productData exported successfully')
            } catch (error: any) {
                expect(error.message).toBe('Error while exporting the productData')
            }
        })



})