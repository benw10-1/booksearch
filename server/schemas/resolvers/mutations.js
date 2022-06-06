const { User } = require('../../models');
const { signToken } = require('../../utils/auth');

async function addUser(parent, args, context, info) {
    const user = await User.create(args)
    const token = signToken(user);

    return { token, user };
}

async function login(parent, args, context, info) {
    const user = await User.findOne({ email: args.email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const valid = await user.isValidPassword(args.password);
    if (!valid) {
        throw new Error('Invalid credentials');
    }

    const token = signToken(user);

    return { token, user };
}

async function saveBook(parent, args, context, info) {
    if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, {
            $push: {
                savedBooks: args.bookData
            }
        }, { new: true });
    }

    throw new Error('You must be logged in to do that');
}

async function removeBook(parent, args, context, info) {
    if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, {
            $pull: {
                savedBooks: { bookId: args.bookId }
            }
        }, { new: true });
    }

    throw new Error('You must be logged in to do that');
}

module.exports = {
    addUser,
    login,
    saveBook,
    removeBook
}
