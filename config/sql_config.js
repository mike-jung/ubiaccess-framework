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
    },
    chat_save_connection: {
        sql: "\
            insert into chat.connection \
                (socket_id, namespace, presence) \
            values \
                (?, ?, 'off')",
        params: [
            'socket_id',
            'namespace'
        ]
    },
    chat_save_disconnect: {
        sql: "\
            update chat.connection \
            set disconnect_date = now(), \
                presence = 'off', \
                modify_date = now() \
            where \
                socket_id = ?",
        params: [
            'socket_id'
        ]
    },
    chat_save_login: {
        sql: "\
            update chat.connection \
            set id = ?, \
                alias = ?, \
                today = ?, \
                presence = 'on', \
                login_date = now(), \
                presence_date = now(), \
                modify_date = now() \
            where \
                socket_id = ?",
        params: [
            'id',
            'alias',
            'today',
            'socket_id'
        ]
    },
    chat_save_logout: {
        sql: "\
            update chat.connection \
            set presence = 'off', \
                logout_date = now(), \
                presence_date = now(), \
                modify_date = now() \
            where \
                id = ? \
                and socket_id = ?",
        params: [
            'id',
            'socket_id'
        ]
    },
    chat_save_message: {
        sql: "\
            insert into chat.message \
                (id, sender, receiver, command, type, data, namespace, status) \
            values \
                (?, ?, ?, ?, ?, ?, ?, ?)",
        params: [
            'id',
            'sender',
            'receiver',
            'command',
            'type',
            'data',
            'namespace',
            'status'
        ]
    },
    chat_save_message_status: {
        sql: "\
            update chat.message \
            set status = ?, \
                sent_date = now(), \
                modify_date = now() \
            where \
                id = ?",
        params: [
            'status',
            'id'
        ]
    },
    chat_reset_presence: {
        sql: "\
            update chat.connection \
            set presence = 'off', \
                modify_date = now() \
            where \
                namespace = ?",
        params: [
            'namespace'
        ]
    },
    chat_get_unsent_messages: {
        sql: "\
            select \
                id, sender, receiver, command, type, data, namespace, status \
            from chat.message \
            where \
                receiver = ? \
                and status = '100' \
                and create_date > DATE_ADD(now(), INTERVAL -1 DAY)",
        params: [
            'receiver'
        ]
    },
    chat_update_unsent_messages: {
        sql: "\
            update chat.message \
                status = '200' \
                ,sent_date = now() \
                ,modify_date = now() \
            where \
                receiver = ? \
                and status = '100' \
                and create_date > DATE_ADD(now(), INTERVAL -1 DAY)",
        params: [
            'receiver'
        ]
    }

}