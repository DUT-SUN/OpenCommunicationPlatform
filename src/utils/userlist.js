const key1 = 'favorite'
const key2 = 'like'
const setfavoriteList = (favoriteList) => {
    return window.localStorage.setItem(key1, favoriteList)
}

const getfavoriteList = () => {
    return window.localStorage.getItem(key1)
}

const removefavoriteList = () => {
    return window.localStorage.removeItem(key1)
}
const setlikeList = (likeList) => {
    return window.localStorage.setItem(key2,likeList)
}

const getlikeList = () => {
    return window.localStorage.getItem(key2)
}

const removelikeList = () => {
    return window.localStorage.removeItem(key2)
}
export {
    setfavoriteList,
    getfavoriteList,
    removefavoriteList,
    setlikeList,
    getlikeList,
    removelikeList,
}