import '../config/mongoDB'
import mongoose from "mongoose";
import { TagService } from '../modules/tag/services/tags';

let tagServiceInstance = new TagService();

let tagBody: any = {
    body:{
        manufacturerName:"hello",
        tagId:"9",
        status:"a",
        batchId:"a",
        tenantId:"a",
        tagInfo:"a"
    }
}

let digitizedTagBody: any = {
    body:{
        tenantId:"a",
        tagId:"9",
        userId:"a",
        deviceId:"a",
        processId:"a",
        projectId:"a",
        siteId:"a",
        zoneId:"a",
        tagInfo:"a",
        status:"a",
        operationTime:"a"
    }
}

let request: any = {
    params: {},
    query: {}
}

describe("Tag test cases", () => {
    describe("creating tag test cases", () => {
        test("creating a tag test case", async () => {
            let tag = await tagServiceInstance.create(tagBody)
            expect(tag).toHaveProperty('status')
        })

        test("creating a tag with existing tagId", async () => {
            try {
                await tagServiceInstance.create(tagBody)
            } catch (error: any) {
                expect(error.message).toBe('tag already exist with tagId 9')
            }
        })
    })

    describe("creating digitizedTag test cases", () => {
        test("creating a digitizedTag test case", async () => {
            let digitizedTag = await tagServiceInstance.digitize(digitizedTagBody)
            expect(digitizedTag).toHaveProperty('status')
        })

        test("creating a digitizedTag with nonExisting tagId", async () => {
            try {
                digitizedTagBody.body.tagId='4'
                await tagServiceInstance.digitize(digitizedTagBody)
            } catch (error: any) {
                expect(error.message).toBe(`no tag found with tagId 4`)
            }
        })
    })

    describe("read tag", () => {
        test("read all tag ", async () => {
            let tag = await tagServiceInstance.readAll(request)
            expect(tag[0]).toHaveProperty('status')
        })

        test("read tag by tagId", async () => {
            request.params.tagId = '9'
            let tag = await tagServiceInstance.readById(request)
            expect(tag).toHaveProperty('status')
        })

        test("read tag by non existing tagId", async () => {
            try {
                request.params.tagId = '4'
                await tagServiceInstance.readById(request)
            } catch (err: any) {
                expect(err.message).toEqual('no tag found with tagId 4')
            }
        })
    })

    describe("read digitizedTag", () => {
        test("read all digitizedTag ", async () => {
            let tag = await tagServiceInstance.readAllDigitized(request)
            expect(tag[0]).toHaveProperty('status')
        })

        test("read digitizedTag by tagId", async () => {
            request.params.tagId = '9'
            let tag = await tagServiceInstance.readByIdDigitized(request)
            expect(tag).toHaveProperty('status')
        })

        test("read digitizedTag by non existing tagId", async () => {
            try {
                request.params.tagId = '4'
                await tagServiceInstance.readByIdDigitized(request)
            } catch (err: any) {
                expect(err.message).toEqual('no tag found with tagId 4')
            }
        })
    })

    describe("delete tag", () => {
        test("Delete tag ", async () => {
            request.params.tagId = '9'
            let tag = await tagServiceInstance.delete(request)
            expect(tag).toEqual('tag deleted successfully with tagId 9')
        })

        test("Delete User with worng tagId", async () => {
            try {
                request.params.tagId = '4'
                await tagServiceInstance.delete(request)
            } catch (err: any) {
                expect(err.message).toEqual('no tag found with tagId 4')
            }
        })
    })

    afterAll(()=>{
        mongoose.connect('mongodb://127.0.0.1:27017/smartcosmos_test',function(){
            mongoose.connection.db.dropDatabase();
        });
    })
})