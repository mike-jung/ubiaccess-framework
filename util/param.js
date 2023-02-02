'use strict';

// 로그
const logger = require('./logger');

// 유틸
const util = require('./util');


const param = {};

///
/// 요청 파라미터 파싱
///

param.parse = function (req) {
    const requestMethod = req.method;
    const requestPath = req.baseUrl + req.path;
    logger.debug(`${requestMethod} ${requestPath} requested`);

    let params;
    if (requestMethod == 'GET') {
        params = req.query;
    } else if (requestMethod == 'POST' || requestMethod == 'PUT' || requestMethod == 'DELETE') {
        params = req.body;
    } else {
        logger.debug(`Unknown request method -> ${requestMethod}`);
    }

    if (req.params) {
        params = Object.assign(req.params, params);
    }
    
    const paramsText = JSON.stringify(params);
    if (paramsText && paramsText.length < 1000) {
        logger.debug(`PARAMS -> ${paramsText}`);
    } else {
        logger.debug(`PARAMS -> over 1000 characters.`);
    }
    

    return params;
}


///
/// 전체 개수를 확인하는 SQL 가져오기
///

param.getCountSql = function(sqlUnit, params) {
  // SQL 파일에 있는 기본 count SQL문 참조
  let sql = sqlUnit.count

  // search문 확인
  sql = this.checkSearchParam(sql, sqlUnit, params)

  return sql
}

///
/// SQL 가져오기
///

param.getSql = function(sqlUnit, params) {
    // SQL 파일에 있는 기본 SQL문 참조
    let sql = sqlUnit.sql

    // search 확인
    sql = this.checkSearchParam(sql, sqlUnit, params)

    // order 확인
    sql = this.checkOrderParam(sql, sqlUnit, params)

    // page 확인
    sql = this.checkPageParam(sql, sqlUnit, params)

    return sql
}

///
/// 요청 파라미터 중에 search가 있는 경우 검색 조건 처리
///

param.checkSearchParam = function(sql, sqlUnit, params) {
    
  // 요청 파라미터에 search가 있는 경우
  if (params.search) {
    let searchStatement = ''

    // search 파라미터가 콤마(,)로 구분되어 있는 경우
    if (params.search.indexOf(',') > 0) {
      // search와 searchValue를 콤마로 구분
      const searchList = params.search.split(',')
      const searchValueList = params.searchValue.split(',')

      for (let i = 0; i < searchList.length; i++) {
        if (i > 0) {
          // searchJoin 파라미터가 있는 경우 전달받은 파라미터 사용하고 아니면 and 사용
          if (params.searchJoin) {
              searchStatement += ` ${params.searchJoin} `
          } else {
              searchStatement += ` and `
          }
        }

        // searchLike가 true이면 like문 사용, false이면 = 문 사용
        if (params.searchLike) {
          searchStatement += `${searchList[i]} like '%${searchValueList[i]}%'`
        } else {
          searchStatement += `${searchList[i]} = '${searchValueList[i]}'`
        }
      }
    } else {
      // search 파라미터가 콤마로 구분되지 않았다면 하나의 파라미터만 사용
      if (params.searchLike) {
        searchStatement += `${params.search} like '%${params.searchValue}%'`
      } else {
        searchStatement += `${params.search} = '${params.searchValue}'`
      }
    }
    logger.debug(`searchStatement -> ${searchStatement}`)

    // SQL 문에 where절 추가
    sql += ` ${util.replace(sqlUnit.where, "#", searchStatement, 0)}`
  }

  return sql
}



///
/// 요청 파라미터 중에 order가 있는 경우 검색 조건 처리
///

param.checkOrderParam = function(sql, sqlUnit, params) {
    
    // 요청 파라미터에 order가 있는 경우
    if (params.order) {
        sql = sql + ' ' + util.replace(sqlUnit.order, '#', params.order + ' ' + params.orderDirection, 0);
    }
          
    return sql
}


///
/// 요청 파라미터 중에 page가 있는 경우 검색 조건 처리
///

param.checkPageParam = function(sql, sqlUnit, params) {

    // 요청 파라미터에 page가 있는 경우
    if (params.page) {
        const curPage = Number(params.page);
        const curPerPage = Number(params.perPage);
        sql = sql + ' ' + util.replace(sqlUnit.page, '#', (curPage-1) * curPerPage + ', ' + curPerPage, 0);
    }
            
    return sql
}
  


module.exports = param;