const { User } = require('../../models');

function me(parent, args, context, info) {
    if (!context.user) throw new Error('You must be logged in to do that'); 

    const user = await User.findById(context.user._id)

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        bookCount: user.bookCount,
        savedBooks: user.savedBooks
    }
}

module.exports = {
    me
}