export const getRouteLink = () => {
    const route = useRoute()

    if(route.params) {
        let parentPath = route.path
        for(const key in route.params) {
            parentPath = parentPath.replace('/' + route.params[key] , '')
        }
        return parentPath
    }

    return route.path
}