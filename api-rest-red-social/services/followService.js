// IPORTACIÓN DE DEPENDENCIAS
const Follow = require('../models/follow');

const followUserIds = async(identity_user_id) => {
    try {
        let following = await Follow.find({user: identity_user_id})
            .select({followed: 1, _id: 0})
            .exec();

        let followers = await Follow.find({followed: identity_user_id})
            .select({user: 1, _id: 0})
            .exec();

        // PROCESAR ARRAY DE IDENTIFICADORES
        const following_clean = [];
        const followers_clean = [];

        following.map((element) => {
            following_clean.push(element.followed);
        });

        followers.map((element, index) => {
            followers_clean.push(element.user);
        });

        return {
            following: following_clean,
            followers: followers_clean
        }
    } catch(error) {
        return {}
    }
}

const followThisUser = async(identity_user_id, profile_user_id) => {
    let following = await Follow.findOne({user: identity_user_id, followed: profile_user_id});
    let follower = await Follow.findOne({user: profile_user_id, followed: identity_user_id});

    return {
        following,
        follower
    }
}

module.exports = {
    followUserIds,
    followThisUser
}