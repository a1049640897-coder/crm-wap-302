import React from "react";
import { SearchBar, Modal, Picker, List, Button, Checkbox, ListView, Calendar, Toast, WingBlank, WhiteSpace } from 'antd-mobile';
import dayjs from "dayjs";
import { getsysInfo, myworkOrder, workOrderTypeurge, workOrderTyperevoke } from '@/services/workOrder'
import LoadMoreAndRefresh from "@/components/LoadMoreAndRefresh";
import './workOrder.less'
import router from "umi/router";
export default class MyworkOrder extends React.Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      revokeId: null,
      modalrevoke: false,
      animatingState: false,
      dateVisible: false,
      warnText: '',
      dataSource,
      modal2: false,
      systemList: [],
      checkoutdata: [
        { value: 1, label: '未处理' },
        { value: 2, label: '处理中' },
        { value: 3, label: '已处理' },
        { value: 4, label: '已撤销' },
      ],
      dateTypeList: [
        { value: 1, label: '添加日期' },
        { value: 2, label: '解决日期' },
      ],
      workData: [],
      listQuery: {
        param: {
          systemId: null,
          keyword: '',
          state: [],
          dateType: 1,
          startDate: '',
          endDate: ''
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
          sort: [
            { column: 'createTime', type: 1 }
          ]
        },
      }
    }
  }
  componentDidMount() {
    this.getsysInfofunciton()
    let workStorData = sessionStorage.getItem("workStorData") ? JSON.parse(sessionStorage.getItem("workStorData")) : {}
    if (workStorData) {
      this.setState({
        listQuery: {
          ...this.state.listQuery,
          param: {
            ...this.state.listQuery.param,
            systemId: workStorData.systemId || '',
            dateType: workStorData.dateType || '',
            startDate: workStorData.startDate || '',
            endDate: workStorData.endDate || '',
            keyword: workStorData.keyword || '',
            state: workStorData.state || [],
          }
        }
      }, () => {
        this.getTableList()
      })
    }
  }
  handeltoeditpage = (item) => {
    this.sessionStoragework()
    router.push({ pathname: '/feedback', query: { workId: item.id } })
  }
  handlerevokeshow = (item) => {
    this.setState({ modalrevoke: true }, () => {
      this.setState({
        revokeId: item.id
      })
    })
  }
  handlerevoke() {
    const { revokeId } = this.state
    workOrderTyperevoke(revokeId).then(res => {
      this.resetPage()
    }).finally(res => {
      this.setState({ modalrevoke: false })
    })
  }
  getTableList = (num = null) => {
    this.setState({ animatingState: true, warnText: '正在加载中...' })
    const { listQuery } = this.state
    if (listQuery.param.systemId) {
      listQuery.param.systemId = listQuery.param.systemId[0] ? listQuery.param.systemId[0] : listQuery.param.systemId
    }
    myworkOrder(listQuery).then(res => {
      const workData = num == 2 ? this.state.workData.concat(res.data) : res.data
      this.setState({
        workData,
        dataSource: this.state.dataSource.cloneWithRows(workData),
        warnText: listQuery.pageInfo.pageNum > res.totalPage ? '没有更多了' : '滑动加载更多'
      }, () => {
      })
    })
  }
  // 获取所属系统列表
  getsysInfofunciton = () => {
    getsysInfo().then(res => {
      this.setState({
        systemList: res.data.map(item => {
          return {
            label: item.title,
            value: item.id
          }
        })
      }, () => {
      })
    })
  }
  handleSearchClear = () => {
    this.setState({
      listQuery: {
        ...this.state.listQuery,
        param: {
          ...this.state.listQuery.param,
          keyword: null
        }
      }
    }, () => {
      this.resetPage()
    });

  }
  handelurge = (item) => {
    workOrderTypeurge(item.id).then(res => {
      Toast.success("已联系管理员处理，请耐心等待", 1);
      this.resetPage()
    })
  }
  urgeShow = (urgeTime, createTimeLong) => {
    let Timer = new Date().getTime();
    if (urgeTime) {
      if (Timer - Number(urgeTime) < 1000 * 60 * 60 * 2) {
        return true
      } else {
        return false
      }
    } else {
      if (Timer - Number(createTimeLong) < 1000 * 60 * 60 * 2) {
        return true
      } else {
        return false
      }
    }
  }
  modalshow = () => {
    const { listQuery } = this.state
    this.setState({ modal2: true }, () => {
      if (listQuery.param.systemId && !Array.isArray(listQuery.param.systemId)) {
        listQuery.param.systemId = [listQuery.param.systemId]
      }
      this.setState({
        listQuery
      })
    })
  }
  onRefresh = _ => {
    this.resetPage()
  }
  modalcomfing = () => {
    this.resetPage()
    this.setState({
      modal2: false
    })
  }
  resetPage = () => { // 重置列表
    this.setState({
      listQuery: {
        ...this.state.listQuery,
        pageInfo: {
          ...this.state.listQuery.pageInfo,
          pageNum: 1
        }

      }
    });
    this.getTableList();
  }
  onEndReached = (v) => {
    const { listQuery } = this.state;
    listQuery.pageInfo.pageNum++
    this.getTableList(2);
    this.setState({ listQuery })
  }

  checkoutChange = (e) => {
    if (this.state.listQuery.param.state.includes(e)) {
      this.state.listQuery.param.state = this.state.listQuery.param.state.filter(item => item != e)
    } else {
      this.state.listQuery.param.state.push(e)
    }
    this.setState({
      listQuery: this.state.listQuery
    }, () => {
      this.resetPage()
    })
  }
  handleCalendar = () => {
    this.setState({
      dateVisible: true
    })
  }
  handleDateConfirm = (startDate, endDate) => {
    const { listQuery } = this.state;
    const { param } = listQuery;
    param.startDate = dayjs(startDate).format("YYYY/MM/DD");
    param.endDate = dayjs(endDate).format("YYYY/MM/DD");
    this.setState({ dateVisible: false, listQuery, modal2: true });
  }
  handleCancelonCancel = () => {
    const { listQuery } = this.state;
    const { param } = listQuery;
    param.startDate = '';
    param.endDate = '';
    this.setState({ dateVisible: false, listQuery })
  }
  handleChange = (e, key) => {
    this.setState({
      listQuery: {
        ...this.state.listQuery,
        param: {
          ...this.state.listQuery.param,
          [key]: e
        }
      }
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  showAlert = () => {
    const alertInstance = alert('Delete', 'Are you sure???', [
      { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
      { text: 'OK', onPress: () => console.log('ok') },
    ]);
  }
  sessionStoragework = () => {
    let { systemId, dateType, startDate, endDate, state, keyword } = this.state.listQuery.param
    let workStorData = {
      systemId,
      dateType,
      startDate,
      endDate,
      state,
      keyword
    }
    sessionStorage.setItem("workStorData", JSON.stringify(workStorData));
  }
  todetailslPage = (item) => {
    this.sessionStoragework()
    router.push({ pathname: '/workOrderdetails', query: { workId: item.id } })
  }
  render() {
    const row = item => (
      <div className="work_list">
        <div className="work_conter">
          <div className="work_conter_heard">
            <div>{item.systemName}{'-'}{
              item.platform == 1 ? 'PC' : 'WAP'
            }{'-'}{item.menuName}</div>
            <span style={{ color: item.state == 1 ? '#F21414 ' : item.state == 2 ? '#0088FE' : item.state == 3 ? '#CCCCCC' : '#999999 ' }}>
              {item.state == 1 ? '未处理' : item.state == 2 ? '处理中' : item.state == 3 ? '已处理' : item.state == 4 ? '已撤销' : null}
            </span>
          </div>
          <div className='work_conter_conter' onClick={() => this.todetailslPage(item)}>
            <div className={item.imgList ? 'left' : 'aginleft'}>
              <div className='left_title'>{item.note}</div>
              <div className='left_data'>{item.createTime}</div>
            </div>
            <div className='right'>
              {item.imgList && item.imgList.length ?
                <img src={item.imgList[0]} style={{ width: "1rem", height: "1rem", marginLeft: "10px" }} alt="" /> :
                <span></span>
              }
            </div>
          </div>
          <div className="work_conter_bottom">
            {(!this.urgeShow(item.urgeTime, item.createTimeLong)) && (item.state == 1 || item.state == 2) ? <div className="work_conter_bottom_item" >
              <img src={require("@/assets/images/workurge.png")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
              <span className="textcolor" onClick={() => this.handelurge(item)}>催促</span>
            </div> : null
            }
            {/* 灰色催促按钮 */}
            {(this.urgeShow(item.urgeTime, item.createTimeLong)) && (item.state == 1 || item.state == 2) ? <div className="work_conter_bottom_item" >
              <img src={require("@/assets/images/huiseworkurge.jpg")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
              <span >催促</span>
            </div> : null
            }
            {item.state == 1 ?
              <div className="work_conter_bottom_item" >
                <img src={require("@/assets/images/workedit.png")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
                <span className="textcolor" onClick={() => this.handeltoeditpage(item)}>编辑</span>
              </div> : null
            }

            {item.state == 1 ?
              <div className="work_conter_bottom_item" >
                <img src={require("@/assets/images/workrevoke.png")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
                <span className="textcolor" onClick={() => this.handlerevokeshow(item)}>撤销</span>
              </div> : null
            }
            {item.state == 4 ?
              <div className="work_conter_bottom_item" >
                <img src={require("@/assets/images/chongxin.png")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
                <span className="textcolor" onClick={() => this.handeltoeditpage(item)}>重新提交</span>
              </div> : null
            }
          </div>
        </div>
      </div>
    );
    const { listQuery, modal2, systemList, checkoutdata, workData, dateTypeList, dateVisible, modalrevoke } = this.state
    const CheckboxItem = Checkbox.CheckboxItem;
    const Item = List.Item
    const { param } = listQuery
    return (
      <div className="workpage">
        <div className="search-condition" >
          <div className="search">
            <SearchBar
              // ref={ref => this.autoFocusInst = ref}
              placeholder="请输入问题描述关键词"
              value={param.keyword}
              onChange={v => { param.keyword = v, this.setState({ listQuery }) }}
              onSubmit={this.resetPage}
              onClear={this.handleSearchClear}
            // showCancelButton
            // onCancel={() => { this.setState({ isSearch: false }, this.handleSearchClear()) }}
            />
          </div>
          <div onClick={this.modalshow}>
            <img src={require("@/assets/images/workscreen.png")} style={{ width: "0.3rem", height: "0.3rem", marginLeft: "10px" }} alt="" />
          </div>
        </div>
        <div className="checkoutdiv">
          {checkoutdata.map(i => (
            <CheckboxItem className='CheckboxItem' key={i.value} checked={param.state.includes(i.value)} onChange={() => this.checkoutChange(i.value)}>
              {i.label}
            </CheckboxItem>
          ))}
        </div>
        <div className="workTips">{'提示：请点击卡片查看解决方案'}</div>
        <div className="work_list" ref={(ref) => this.ref = ref}>
          {
            workData.length ? <LoadMoreAndRefresh
              warnText={this.state.warnText}
              // isClickFilter={}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              dataSource={this.state.dataSource}
              // isLoading={this.state.isLoading}
              // refreshing={this.state.refreshing}
              row={row}
            /> :
              <div className="no-data">
                <img src={require('@/assets/images/order-no.png')} alt="" />
                <div>暂无记录</div>
              </div>
          }
        </div>
        <Modal
          popup
          visible={modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
        >
          <div className="Modalsaixuan" style={{ fontSize: '0.3rem', color: '#333333', marginTop: '0.4rem', marginBottom: '0.2rem' }}>筛选</div>
          <Picker
            data={systemList}
            value={param.systemId}
            cols={1}
            onChange={e => this.handleChange(e, 'systemId')}
          >
            <List.Item arrow="horizontal">所属系统</List.Item>
          </Picker>
          <Picker
            data={dateTypeList}
            value={[param.dateType]}
            cols={1}
            onChange={e => this.handleChange(e[0], 'dateType')}
          >
            <List.Item arrow="horizontal">日期类型</List.Item>
          </Picker>
          <List arrow="horizontal" onClick={this.handleCalendar}>
            <Item extra={
              param.startDate ? param.startDate + '-' + param.endDate : null
            } arrow="horizontal" onClick={() => { }}>{param.dateType == 1 ? '添加日期' : "解决日期"}</Item>
          </List>
          <Calendar
            visible={dateVisible}
            defaultValue={param.startDate ? [new Date(param.startDate), new Date(param.endDate)] : []}
            onConfirm={this.handleDateConfirm}
            onCancel={this.handleCancelonCancel}
          >
          </Calendar>
          <div className="modalbottom" style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '0.4rem', marginBottom: '0.2rem' }}>
            <Button onClick={this.onClose('modal2')} style={{ width: '300px' }}>取消</Button>
            <Button type="primary" onClick={this.modalcomfing} style={{ width: '300px' }}>确定</Button>
          </div>
        </Modal >
        <Modal
          visible={this.state.modalrevoke}
          transparent
          maskClosable={false}
          onClose={this.onClose('modalrevoke')}
          title="确定撤销吗？"
          footer={[{ text: '取消', onPress: () => { this.onClose('modalrevoke')() } },
          { text: '确定', onPress: () => { this.handlerevoke() } },
          ]}
          // footer={[{ text: 'Ok', onPress: () => {this.onClose('modalrevoke')(); } }]}
          afterClose={() => { this.setState({ revokeId: null }) }}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
        </Modal>


      </div >
    )
  }
}