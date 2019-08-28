module.exports = {
    panda_list: {
        sql: "select \
                id, \
                name, \
                age \
            from #",
        where: [
            {
                name: "name like #"
            },
            {
                age: "age > #"
            }
        ],
        order: " order by # ",
        page: " limit # ",
        params: []
    }
}