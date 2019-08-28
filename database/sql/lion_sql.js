module.exports = {
    lion_list: {
        sql: "select \
                id, \
                name, \
                mobile \
            from test.lion",
        count: "select count(*) as total \
                from test.lion",
        where: " where # ",
        order: " order by # ",
        page: " limit # ",
        params: []
    },
    lion_create: {
        sql: "insert into test.lion \
                    (id, name, mobile) \
              values (?, ?, ?)",
        params: [
            'id',
            'name',
            'mobile'
        ]
    },
    lion_read: {
        sql: "select \
                id, \
                name, \
                mobile \
            from test.lion \
            where id = ?",
        params: [
            'id'
        ]
    },
    lion_update: {
        sql: "update test.lion \
              set name = ?, \
                  mobile = ? \
              where id = ?",
        params: [
            'name',
            'mobile',
            'id'
        ]
    },
    lion_delete: {
        sql: "delete from test.lion \
            where id = ?",
        params: [
            'id'
        ]
    }
}