import conf from "../conf/conf.js"
import { Client, ID, Databases, Storage, Query } from "appwrite"

export class Service{
    client = new Client();
    database;
    storage;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        
        this.database = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({slug, title, content, featuredImage, status, userId}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    status,
                    featuredImage,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return false;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.database.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title, 
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            return false;
        }
    }

    async deletePost(slug){
        try {
            await this.database.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    //files

    async uploadFile(file){
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.storage.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service();

export default service;