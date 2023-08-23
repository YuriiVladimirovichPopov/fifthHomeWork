import { ObjectId} from "mongodb";
import { usersCollection } from "../db/db";
import { UsersMongoDbType } from '../types';
import { PaginatedType } from "../routers/helpers/pagination";
import { UserViewModel } from "../models/users/userViewModel";
import { UserInputModel } from "../models/users/userInputModel";
import { PaginatedUser } from "../models/users/paginatedQueryUser";


export const usersRepository = {

    _userMapper(user: UsersMongoDbType): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,              // TODO fix it all
            createdAt: user.createdAt,
            
        }
    },

    
    async findAllUsers(pagination: PaginatedType): Promise<PaginatedUser<UserViewModel[]>> {
        // {$or: [{email}, {login}]}
        const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}} // $or || $and 
        const result: UsersMongoDbType[] =
        await usersCollection.find(filter) 
            
          .sort({[pagination.sortBy]: pagination.sortDirection})
          .skip(pagination.skip)
          .limit(pagination.pageSize)
          .toArray()
          
          const totalCount: number = await usersCollection.countDocuments(filter)
          const pageCount: number = Math.ceil(totalCount / pagination.pageSize)
    
          const res: PaginatedUser<UserViewModel[]> = {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: result.map(b => this._userMapper(b))
            }
          return res
    },

   
    async findUserById(id: string):Promise<UserViewModel | null> {
        const userById = await usersCollection.findOne({_id: new ObjectId(id)},)
        if(!userById) {
            return null
        }
            return this._userMapper(userById)
    }, 
    
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
        return user
    },
    
    async createUser(newUser: UsersMongoDbType): Promise<UserViewModel> { 
        await usersCollection.insertOne(newUser)
        return this._userMapper(newUser)
    },

   
    async updateUser(id: string, data: UserInputModel ): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const foundUserById = await usersCollection.updateOne({_id}, {$set: {...data}})
        return foundUserById.matchedCount === 1
    },
    
   
    async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const foundUserById = await usersCollection.deleteOne({_id})
        
        return foundUserById.deletedCount === 1
    }, 
    
    async deleteAllUsers(): Promise<boolean> {
        try {
            const result = await usersCollection.deleteMany({});
            return result.acknowledged === true
        } catch (error) {
            return false
        }
    }
}

//function _blogMapper(): any {
//throw new Error("Function not implemented.");
//}







//export const usersRepository = [
//    {
//        id: 1,
//        loginPassword: 'Basic YWRtaW46cXdlcnR5',
//    }
//]//