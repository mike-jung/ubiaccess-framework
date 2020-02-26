/**
 * This controller just loads a view file as a index page and send it to the client 
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/sheep.do
 * 
 */

'use strict'
 
const util = require('../util/util');
const logger = require('../util/logger');
const param = require('../util/param');
const Database = require('../database/database_mysql');

class Index {

    constructor() {
        this.database = new Database('database_mysql');
    }
  
    /**
     * @RequestMapping(path="/sheep.do", method="get")
     */
    sheepIndex(req, res) {
        logger.debug('sheepIndex called for path /sheep.do');
 
        util.render(req, res, 'sheep_index', {});
    }

    /**
     * @RequestMapping(path="/sheep2.do", method="get")
     */
    sheepIndex2(req, res) {
        logger.debug('sheepIndex2 called for path /sheep2.do');
 
        util.render(req, res, 'sheep_index2', {});
    }
 
    /**
     * @RequestMapping(path="/sheep3.do", method="get")
     */
    sheepIndex3(req, res) {
        logger.debug('sheepIndex3 called for path /sheep3.do');
 
        util.render(req, res, 'sheep_index3', {});
    }
 
    /**
     * @RequestMapping(path="/sheep4.do", method="get")
     */
    sheepIndex4(req, res) {
        logger.debug('sheepIndex4 called for path /sheep4.do');
 
        util.render(req, res, 'sheep_index4', {});
    }
 
    /**
     * @RequestMapping(path="/esl-index.do", method="get")
     */
    eslIndex(req, res) {
        logger.debug('eslIndex called for path /esl-index.do');
 
        util.render(req, res, 'esl_index', {});
    }
 

    // MIKE START 191220

    /**
     * @RequestMapping(path="/sboard.do", method="get")
     */
    async sboardIndex(req, res) {
        logger.debug('sboardIndex called for path /sboard.do');

        const params = param.parse(req);
 
        // select agentId list and roomId list using deptId
        
        const queryParams1 = {
            sqlName: 'sboard_dept_mapping_select',
            params: params,
            paramType: {
                deptId: 'string'
            }
        }

        let deptId = '';
        let deptName = '';
        let agentIdList = [];
        let agentNameList = [];
        let roomIdList = [];
        let roomNameList = [];
        try {
            const rows1 = await this.database.execute(queryParams1);
            if (rows1.length > 0) {
                deptId = rows1[0].dept_id;
                deptName = rows1[0].dept_name;
                
                let agentIdStr = rows1[0].agent_id;
                agentIdList = agentIdStr.split(',');
                for (let i = 0; i < agentIdList.length; i++) {
                    if (typeof(agentIdList[i]) == 'string') {
                        agentIdList[i] = agentIdList[i].trim();
                    }
                }

                let agentNameStr = rows1[0].agent_name;
                agentNameList = agentNameStr.split(',');
                for (let i = 0; i < agentNameList.length; i++) {
                    if (typeof(agentNameList[i]) == 'string') {
                        agentNameList[i] = agentNameList[i].trim();
                    }
                }

                let roomIdStr = rows1[0].room_id;
                roomIdList = roomIdStr.split(',');
                for (let i = 0; i < roomIdList.length; i++) {
                    if (typeof(roomIdList[i]) == 'string') {
                        roomIdList[i] = roomIdList[i].trim();
                    }
                }

                let roomNameStr = rows1[0].room_name;
                roomNameList = roomNameStr.split(',');
                for (let i = 0; i < roomNameList.length; i++) {
                    if (typeof(roomNameList[i]) == 'string') {
                        roomNameList[i] = roomNameList[i].trim();
                    }
                }

            }
        } catch(err) {
            util.sendError(res, 400, 'Error in getting agent list and room list -> ' + err);
            return;
        }
        
        let targetUnit = 'agent';
        let targetAgentId = '';
        let targetAgentName = '';
        if (agentIdList.length > 0) {
            targetAgentId = agentIdList[0];
            targetAgentName = agentNameList[0];
        }

        let targetRoomId = '';
        let targetRoomName = '';
        if (roomIdList.length > 0) {
            targetRoomId = roomIdList[0];
            targetRoomName = roomNameList[0];
        }


        const context = {
            deptId: deptId,
            deptName: deptName,
            agentIdList: agentIdList,
            agentNameList: agentNameList,
            roomIdList: roomIdList,
            roomNameList: roomNameList,
            targetUnit: targetUnit,
            targetAgentId: targetAgentId,
            targetAgentName: targetAgentName,
            targetRoomId: targetRoomId,
            targetRoomName: targetRoomName
        }
        logger.debug('Context for rendering -> ' + JSON.stringify(context));
  
        util.render(req, res, 'sboard', context);
    }
 

    /**
     * @RequestMapping(path="/sboard1.do", method="get")
     */
    async sboard1Index(req, res) {
        logger.debug('sboard1Index called for path /sboard1.do');

        const params = param.parse(req);


        // MIKE START 191215
        // select agentId using roomId
        let agentId = '';
        let updateUnit = '';
        
        if (params.agentId) {
            logger.debug('agentId exists.');

            updateUnit = 'agent';

            agentId = params.agentId;
        } else {
            logger.debug('agentId not exist.');

            updateUnit = 'room';

            const queryParams1 = {
                sqlName: 'sboard_room_mapping_select',
                params: params,
                paramType: {
                    roomId: 'string'
                }
            }

            try {
                const rows1 = await this.database.execute(queryParams1);
                if (rows1.length > 0) {
                    agentId = rows1[0].agent_id;
                }
            } catch(err) {
                util.sendError(res, 400, 'Error in getting agent id -> ' + err);
                return;
            }
        }

        
        const context = {
            userId: params.userId,
            updateUnit: updateUnit,
            roomId: params.roomId,
            agentId: agentId,
            agentName: params.title,
            deptId: params.deptId
        }
        logger.debug('Context for rendering -> ' + JSON.stringify(context));
 
        // MIKE END 191215

        util.render(req, res, 'sboard1', context);
    }
 
    /**
     * @RequestMapping(path="/sboard2.do", method="get")
     */
    async sboard2Index(req, res) {
        logger.debug('sboard2Index called for path /sboard2.do');

        const params = param.parse(req);

        // select room data using roomId
        let roomName = '';
        let doctorName = '';
        let delayTime = '';
        let delayReason = '';
        let ongoingName = '';
        let waitingName1 = '';
        let waitingName2 = '';
        let waitingName3 = '';
        let waitingName4 = '';
        let waitingName5 = '';

        const queryParams1 = {
            sqlName: 'sboard_room_data_select',
            params: params,
            paramType: {
                roomId: 'string'
            }
        }

        try {
            const rows1 = await this.database.execute(queryParams1);
            if (rows1.length > 0) {
                roomName = rows1[0].room_name;
                doctorName = rows1[0].doctor_name;
                delayTime = rows1[0].delay_time;
                delayReason = rows1[0].delay_reason;
                ongoingName = rows1[0].ongoing_name;
                waitingName1 = rows1[0].waiting_name1;
                waitingName2 = rows1[0].waiting_name2;
                waitingName3 = rows1[0].waiting_name3;
                waitingName4 = rows1[0].waiting_name4;
                waitingName5 = rows1[0].waiting_name5;
            }
        } catch(err) {
            util.sendError(res, 400, 'Error in getting agent id -> ' + err);
            return;
        }

        const context = {
            title: params.title,
            userId: params.userId,
            roomId: params.roomId,
            roomName: roomName,
            doctorName: doctorName,
            delayTime: delayTime,
            delayReason: delayReason,
            ongoingName: ongoingName,
            waitingName1: waitingName1,
            waitingName2: waitingName2,
            waitingName3: waitingName3,
            waitingName4: waitingName4,
            waitingName5: waitingName5,
            deptId: params.deptId
        }
        logger.debug('Context for rendering -> ' + JSON.stringify(context));
 
        util.render(req, res, 'sboard2', context);
    }
 
}

module.exports = Index;
