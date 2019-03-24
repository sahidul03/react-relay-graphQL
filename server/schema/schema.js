const graphql = require('graphql');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        created_by: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.created_by);
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find({ category: parent.id });
            }
        },
    })
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        details: { type: GraphQLString },
        price: { type: GraphQLInt },
        created_by: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.created_by);
            }
        },
        category: {
            type: CategoryType,
            resolve(parent, args){
                return Category.findById(parent.category);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({ created_by: parent.id });
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find({ created_by: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findById(args.id);
            }
        },
        category: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Category.findById(args.id);
            }
        },
        product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Product.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({});
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find({});
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                email: { type: GraphQLString }
            },
            resolve(parent, args){
                let user = new User({
                    name: args.name,
                    age: args.age,
                    email: args.email
                });
                return user.save();
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                created_by: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let category = new Category({
                    title: args.title,
                    created_by: args.created_by
                });
                return category.save();
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                details: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
                discount: { type: new GraphQLNonNull(GraphQLInt) },
                created_by: { type: new GraphQLNonNull(GraphQLID) },
                category: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let product = new Product({
                    title: args.title,
                    details: args.details,
                    price: args.price,
                    discount: args.discount,
                    created_by: args.created_by,
                    category: args.category
                });
                return product.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
