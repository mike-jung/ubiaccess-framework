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
                    (name, mobile) \
              values (:name, :mobile)"
    },
    lion_read: {
        sql: "select \
                id, \
                name, \
                mobile \
            from test.lion \
            where id = :id"
    },
    lion_update: {
        sql: "update test.lion \
              set name = :name, \
                  mobile = :mobile \
              where id = :id"
    },
    lion_delete: {
        sql: "delete from test.lion \
            where id = :id"
    }
}