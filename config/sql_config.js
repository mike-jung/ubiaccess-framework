module.exports = {
    table_list: {
        sql: "select # \
              from #",
        count: "select count(*) as total \
                from #",
        where: " where # ",
        order: " order by # ",
        page: " limit # ",
        params: []
    },
    table_create: {
        sql: "insert into # \
                    (#) \
              values (#)",
        params: []
    },
    table_read: {
        sql: "select # \
            from #",
        where: " where # ",
        params: []
    },
    table_update: {
        sql: "update # \
              set #",
        where: " where # ",
        params: []
    },
    table_delete: {
        sql: "delete from #",
        where: " where # ",
        params: []
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
                (:id, :sender, :receiver, :command, :type, :data, :namespace, :status)"
    },
    chat_save_message_status: {
        sql: "\
            update chat.message \
            set status = :status, \
                sent_date = now(), \
                modify_date = now() \
            where \
                id = :id"
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