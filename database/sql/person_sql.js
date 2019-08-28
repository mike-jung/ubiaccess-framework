module.exports = {
    person_login: {
        sql: "select \
                id \
            from test.users \
            where id = ? and password = ?",
        params: [
            'id',
            'password'
        ]
    },
    person_list: {
        sql: "select \
                id, \
                name, \
                age, \
                mobile \
            from test.person",
        params: []
    },
    person_read: {
        sql: "select \
                id, \
                name, \
                age, \
                mobile \
            from test.person \
            where id = ?",
        params: [
            'id'
        ]
    },
    person_create: {
        sql: "insert into test.person \
                    (id, name, age, mobile) \
              values (?, ?, ?, ?)",
        params: [
            'id',
            'name',
            'age',
            'mobile'
        ]
    },
    person_update: {
        sql: "update test.person \
              set name = ?, \
                  age = ?, \
                  mobile = ? \
              where id = ?",
        params: [
            'name',
            'age',
            'mobile',
            'id'
        ]
    },
    person_delete: {
        sql: "delete from test.person \
            where id = ?",
        params: [
            'id'
        ]
    },
    person_get: {
        sql: "select \
                id, \
                name, \
                age, \
                mobile \
            from test.person \
            where name like ?",
        params: [
            'name'
        ]
    },
    person_add: {
        sql: "insert into test.person \
                    (name, age, mobile) \
              values (?, ?, ?)",
        params: [
            'name',
            'age',
            'mobile'
        ]
    }
}