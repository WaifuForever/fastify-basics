import User, { IUser } from '../models/user.model';
import { hashPassword } from '../utils/password.util';

const store = async (req: any, reply: any) => {
    const { email, password, name }: IUser = req.body;

    const newUser: IUser = new User({
        email: email,
        password: await hashPassword(password),
        name: name
    });

    newUser
        .save()
        .then(result => {
            return reply.code(201).send({
                data: { email: result.email, _id: result._id },
                message: "User created!",
            });
        })
        .catch(err => {
            if (err.name === 'MongoServerError' && err.code === 11000) {
                //There was a duplicate key error
                return reply.code(400).send({
                    message: "Email already in use",
                    err: err,
                });
            }
            return reply.code(400).send({
                message: "Bad Request",
                err: err,
            });
        });
    
    
};

export default { store };
