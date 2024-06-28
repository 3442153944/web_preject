import json

from django.http import JsonResponse
from django.views import View
from django.db import connection
from ..log.log import Logger

class GetAllUserInfo(View):

    logger = Logger()
    # 允许所有跨域
    def options(self, request, *args, **kwargs):
        return JsonResponse({'status': 'success', 'message': 'ok'})
    def get(self,request, *args, **kwargs):
        try:
            with connection.cursor() as cursor:
                sql = 'SELECT * FROM users'
                cursor.execute(sql)
                columns = [desc[0] for desc in cursor.description]
                result = cursor.fetchall()
                rows = [dict(zip(columns, row)) for row in result]
                #del password
                for row in rows:
                    del row['password']
                print(rows)
            if rows:
                return JsonResponse({'status': 'success', 'data': rows})
            else:
                return JsonResponse({'status': 'failure', 'message': 'No data found'}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    def post(self, request, *args, **kwargs):
        try:
            with connection.cursor() as cursor:
                data = json.loads(request.body.decode('utf-8'))
                userid=data['userid']
                print(data)
                if userid:
                    userid = str(userid)
                else:
                    return JsonResponse({'status': 'failure', 'message': 'No userid found'}, status=400)
                sql = 'SELECT * FROM users WHERE userid = %s'
                cursor.execute(sql, [userid])
                columns = [desc[0] for desc in cursor.description]
                result = cursor.fetchall()
                rows = [dict(zip(columns, row)) for row in result]
                for row in rows:
                    del row['password']
                print(rows)
            if rows:
                self.logger.info(rows)
                return JsonResponse({'status': 'success', 'data': rows})
            else:
                self.logger.warning(data)
                return JsonResponse({'status': 'failure', 'message': 'No data found'}, status=400)
        except Exception as e:
            print(e)
            self.logger.error(e)
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)