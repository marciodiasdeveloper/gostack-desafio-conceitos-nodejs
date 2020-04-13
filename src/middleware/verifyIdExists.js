module.exports = function(array){
    return function(request, response, next) {
        const { id }  = request.params; 
        const repositoryIndex = array.findIndex(repository => repository.id === id);
        if(repositoryIndex < 0) {
            return response.status(400).json({ error: 'repository not found'});
        } 
        request.index = repositoryIndex;      
        return next();
    }
}