from flask import Blueprint, request, jsonify,Response
from app.models.tools import Tools  
from flask_cors import CORS  # 导入 CORS

import json

tools_bp = Blueprint('tools', __name__)

CORS(tools_bp)  # 允许跨域请求

@tools_bp.route('/api/tools', methods=['POST'])
def search_tools():
    from app import app, db
    # 获取分页参数
    page = request.json.get('page', 1)
    per_page = request.json.get('per_page', 10)

    # 获取搜索参数
    code = request.json.get('code', '')
    url = request.json.get('url', '')
    description = request.json.get('description', '')
    tool_type = request.json.get('type', '')
    channel = request.json.get('channel', '')
    data_schema = request.json.get('data_schema', '')
    is_active = request.json.get('is_active', None)

    # 构建查询条件
    query = Tools.query

    if code:
        query = query.filter(Tools.code.like(f'%{code}%'))
    if url:
        query = query.filter(Tools.url.like(f'%{url}%'))
    if description:
        query = query.filter(Tools.description.like(f'%{description}%'))
    if tool_type:
        query = query.filter(Tools.type.like(f'%{tool_type}%'))
    if channel:
        query = query.filter(Tools.channel.like(f'%{channel}%'))
    if is_active is not None:
        query = query.filter(Tools.is_active == is_active)

    # 分页查询
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    tools = pagination.items

    # 组装结果
    result = {
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'tools': [tool.to_dict() for tool in tools]
    }
    return Response(json.dumps(result),content_type="application/json",status=200)

@tools_bp.route('/api/tools/save', methods=['POST'])
def create_or_update_tool():
    from app import db
    # 获取请求数据
    data = request.json
    tool_id = data.get('id', None)

    if tool_id:
        # 修改现有工具
        tool = Tools.query.get(tool_id)
        if not tool:
            return jsonify({'message': 'Tool not found'}), 404
    else:
        # 新增工具
        tool = Tools()

    # 更新工具属性
    tool.code = data.get('code', tool.code)
    tool.url = data.get('url', tool.url)
    tool.api_key = data.get('api_key', tool.api_key)
    tool.description = data.get('description', tool.description)
    tool.type = data.get('type', tool.type)
    tool.channel = data.get('channel', tool.channel)
    tool.data_schema = data.get('data_schema', tool.data_schema)
    tool.is_active = data.get('is_active', tool.is_active)

    # 保存到数据库
    db.session.add(tool)
    db.session.commit()

    return Response(json.dumps(tool.to_dict()),content_type="application/json",status=200)

@tools_bp.route('/api/tools/delete', methods=['POST'])
def delete_tool():
    from app import db
    # 获取请求数据
    data = request.json
    tool_id = data.get('id', None)

    if not tool_id:
        return jsonify({'message': 'Tool ID is required'}), 400

    # 查找工具
    tool = Tools.query.get(tool_id)
    if not tool:
        return jsonify({'message': 'Tool not found'}), 404

    # 删除工具
    db.session.delete(tool)
    db.session.commit()

    return jsonify({'message': 'Tool deleted successfully'}), 200