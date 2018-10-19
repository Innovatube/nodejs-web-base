import moment from 'moment';
import _ from 'lodash';
import fs from 'fs';
import {uuid} from '../utils/helper';
import ExportModel from '../models/export.model';
import FileModel from '../models/file.model';
import XlsxPopulate from '../utils/excel/XlsxPopulate';
import * as Helper from '../utils/helper';
import * as StopService from '../services/stop.service';

export default class ExportService {

  constructor(){
    this.styleCellCommon = {
      horizontalAlignment: 'center',
      fontFamily: 'Arial',
      fontSize: 10,
      verticalAlignment: 'center',
      borderStyle: 'thin',
      shrinkToFit: true
    };

    this.styleCellInstruction = {
      ...this.styleCellCommon,
      wrapText: true,
      fontColor: '#000'
    };

    this.styleCellInstructionRequired = {
      ...this.styleCellInstruction,
      fill: {
        type: 'solid',
        color: {
          rgb: "ffff00"
        }
      }
    };

    this.styleCellInstructionOptional = {
      ...this.styleCellInstruction,
      fill: {
        type: 'solid',
        color: {
          rgb: "acacac"
        }
      }
    }
  }
  /**
   * Find one by where
   * 
   * @param fleetId
   * @param {Number} jobId
   * @param {Number} userId
   * @param fileTemplate
   * @returns {Promise<*>|Model<*>}
   */
  static async findExistsReport(fleetId, jobId, userId, fileTemplate){
    return ExportModel.findOne({
      where: {
        user_id: userId,
        job_id: jobId,
        fleet_id: fleetId,
        type: fileTemplate
      },
      include: [{model: FileModel}]
    })
  }

  /**
   * Save File to export
   *
   * @param {object} options
   * @param {object} data
   * @returns {Promise<*>|Model<*>}
   */
  static async save(data, options){
    return await ExportModel.create(data, options);
  }

  /**
   * Load database to report file
   *
   * @param {object} job
   * @param {object} fleet
   * @return {File}
   */
  async createReport(job, fleet){
    const elsxReport = await XlsxPopulate.fromBlankAsync();
    elsxReport.sheet(0).name('summary');
    elsxReport.addSheet('detail');
    const summarySheet = elsxReport.sheet(0);
    const detailSheet = elsxReport.sheet(1);
    this.creatTripSummaryHead(summarySheet);
    this.creatVehicleSummaryHead(summarySheet);
    this.creatDetailHeadSheet(detailSheet);

    summarySheet.column('J').width(5);
    const vehicleTrips = {};

    let iPlan = 3;
    let iRowLeg = 2;
    fleet.plans = fleet.plans.map(plan => {
      let legs = plan.legs;
      if (legs[0].start_id === legs[legs.length - 1].stop_id) {
        plan.num_of_drop = plan.num_of_route - 1;

      } else {
        plan.num_of_drop = plan.num_of_route;
      }

      return plan;
    });

    fleet.plans.forEach(plan => {
      vehicleTrips[plan.get('client_vehicle_id')] = this.createDataVehicleTrips(vehicleTrips[plan.get('client_vehicle_id')], plan);
      this.createBodySummarySheet(summarySheet, iPlan, plan);
      let iLeg = 0;
      plan.legs.forEach(leg => {
        this.createBodyDetailSheet(detailSheet, iPlan, plan, iRowLeg, leg, false);
        iLeg++;
        if (iLeg === plan.legs.length) {
          iRowLeg++;
          this.createBodyDetailSheet(detailSheet, iPlan, plan, iRowLeg, leg, true);
        }
        iRowLeg++;
      });
      iPlan++;
    });
    if (vehicleTrips) {
      this.createVehicleSummaryCells(summarySheet, vehicleTrips);
    }
    const name = 'out-report-' + job.get('user_id') + '-' + job.get('id') + '-' + uuid() +'.xlsx';
    await elsxReport.toFileAsync('./uploads/' + name);
    const fileInfo = fs.statSync('./uploads/' + name);
    return {
      filename: name,
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      originalname: name,
      size: fileInfo.size,
    };
  }
  
  /**
   * Private function create sheet name summary
   * 
   * @param {XlsxPopulate} summarySheet 
   * @returns {XlsxPopulate}
   */

  creatTripSummaryHead(summarySheet){
    summarySheet.row(1).height(20);
    summarySheet.range('A1:I1').merged(true).value('Trip Summary')
      .style({
        bold: true,
        horizontalAlignment: 'center',
        fontFamily: 'Arial',
        fontSize: 12,
        verticalAlignment: 'center',
        borderColor: 'black',
        borderStyle: 'thin',
      });
    summarySheet.range('A2:I2').style({
      horizontalAlignment: 'center',
      fontFamily: 'Arial',
      fontSize: 10,
      verticalAlignment: 'center',
      borderColor: 'black',
      borderStyle: 'thin',
    });
    summarySheet.column('B').width(20);
    summarySheet.column('C').width(20);
    summarySheet.column('D').width(20);
    summarySheet.column('E').width(20);
    summarySheet.column('F').width(20);
    summarySheet.column('G').width(20);
    summarySheet.column('H').width(20);
    summarySheet.column('I').width(20);
    summarySheet.cell('A2').value('VehicleID');
    summarySheet.cell('B2').value('StartTime');
    summarySheet.cell('C2').value('EndTime');
    summarySheet.cell('D2').value('NumOfDrop');
    summarySheet.cell('E2').value('TotalVolume');
    summarySheet.cell('F2').value('TotalWeight');
    summarySheet.cell('G2').value('TotalDistance[km]');
    summarySheet.cell('H2').value('TotalETA[min]');
    summarySheet.cell('I2').value('Avg_Speed[km/hr]');
    return summarySheet;
  }

  /**
   * Private creat vehicle summary head
   * 
   * @param {XlsxPopulate} summarySheet 
   * @returns {XlsxPopulate}
   */
  creatVehicleSummaryHead(summarySheet){
    summarySheet.range('K1:S1').merged(true).value('Vehicle Summary')
      .style({
        bold: true,
        horizontalAlignment: 'center',
        fontFamily: 'Arial',
        fontSize: 12,
        verticalAlignment: 'center',
        borderColor: 'black',
        borderStyle: 'thin',
      });
    summarySheet.range('K2:S2').style(this.styleCellCommon);
    summarySheet.column('K').width(20);
    summarySheet.column('L').width(20);
    summarySheet.column('M').width(20);
    summarySheet.column('N').width(20);
    summarySheet.column('O').width(20);
    summarySheet.column('P').width(20);
    summarySheet.column('Q').width(20);
    summarySheet.column('R').width(20);
    summarySheet.column('S').width(20);
    summarySheet.cell('K2').value('VehicleID');
    summarySheet.cell('L2').value('NumOfTrip');
    summarySheet.cell('M2').value('StartTime');
    summarySheet.cell('N2').value('EndTime');
    summarySheet.cell('O2').value('NumOfDrop');
    summarySheet.cell('P2').value('TotalVolume');
    summarySheet.cell('Q2').value('TotalWeight');
    summarySheet.cell('R2').value('TotalDistance[km]');
    summarySheet.cell('S2').value('TotalETA[min]');
    return summarySheet;
  }

  /**
   * Private create body summary sheet
   * 
   * @param {XlsxPopulate} summarySheet 
   * @param {Number} iPlan
   * @param {Model} plan
   * @returns {XlsxPopulate}
   */
  createBodySummarySheet(summarySheet, iPlan, plan){
    summarySheet.cell('A' + iPlan).value(plan.get('client_vehicle_id')).style(this.styleCellCommon);
    summarySheet.cell('B' + iPlan).value(plan.get('time_start')).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
    summarySheet.cell('C' + iPlan).value(plan.get('time_end')).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
    summarySheet.cell('D' + iPlan).value(plan.num_of_drop).style(this.styleCellCommon);
    summarySheet.cell('E' + iPlan).value(plan.get('total_volume')).style(this.styleCellCommon);
    summarySheet.cell('F' + iPlan).value(plan.get('total_weight')).style(this.styleCellCommon);
    const totalDistanceInKm = Helper.roundOneDigit(plan.total_distance / 1000);
    summarySheet.cell('G' + iPlan).value(totalDistanceInKm).style(this.styleCellCommon);
    summarySheet.cell('H' + iPlan).value(plan.get('total_eta')).style(this.styleCellCommon);
    const avgSpeed = Helper.roundOneDigit(totalDistanceInKm / (plan.total_eta / 60));
    summarySheet.cell('I' + iPlan).value(avgSpeed).style(this.styleCellCommon);
    return summarySheet;
  }

  /**
   * Private create Vehicle Summary
   * 
   * @param {XlsxPopulate} summarySheet
   * @param {Object} vehicleTrips
   * @returns {XlsxPopulate}
   */
  createVehicleSummaryCells(summarySheet, vehicleTrips){
    let iVehicleTrip = 3;
    _.forEach(vehicleTrips, (vVehicle, kVehicle) => {
      summarySheet.cell('K' + iVehicleTrip).value(kVehicle).style(this.styleCellCommon);
      summarySheet.cell('L' + iVehicleTrip).value(vVehicle.numOfTrip).style(this.styleCellCommon);
      summarySheet.cell('M' + iVehicleTrip).value(vVehicle.startTime).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
      summarySheet.cell('N' + iVehicleTrip).value(vVehicle.endTime).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
      summarySheet.cell('O' + iVehicleTrip).value(vVehicle.numOfDrop).style(this.styleCellCommon);
      summarySheet.cell('P' + iVehicleTrip).value(vVehicle.totalVolume).style(this.styleCellCommon);
      summarySheet.cell('Q' + iVehicleTrip).value(vVehicle.totalWeight).style(this.styleCellCommon);
      const totalDistanceInKm = Helper.roundOneDigit(vVehicle.totalDistance / 1000);
      summarySheet.cell('R' + iVehicleTrip).value(totalDistanceInKm).style(this.styleCellCommon);
      summarySheet.cell('S' + iVehicleTrip).value(vVehicle.totalETA).style(this.styleCellCommon);
      iVehicleTrip++;
    });
    return summarySheet;
  }
  /**
   * Create data vehicle trips
   * 
   * @param {Object} vehicleTrip
   * @param {Model} plan
   * @returns {Object}
   */
  createDataVehicleTrips(vehicleTrip, plan){
    if (vehicleTrip && typeof vehicleTrip === 'object') {
      const startTime = moment(vehicleTrip.startTime).isBefore(plan.get('time_start')) ? vehicleTrip.startTime : plan.get('time_start');
      const endTime = moment(vehicleTrip.endTime).isBefore(plan.get('time_end')) ? plan.get('time_end') : vehicleTrip.endTime;
      return {
        numOfTrip: Number(vehicleTrip.numOfTrip) + 1,
        startTime,
        endTime,
        numOfDrop: Number(vehicleTrip.numOfDrop) + Number(plan.num_of_drop),
        totalVolume: Number(vehicleTrip.totalVolume) + Number(plan.get('total_volume')),
        totalWeight: Number(vehicleTrip.totalWeight) + Number(plan.get('total_weight')),
        totalDistance: Number(vehicleTrip.totalDistance) + Number(plan.get('total_distance')),
        totalETA: Number(vehicleTrip.totalETA) + Number(plan.get('total_eta')),
      }
    } else {
      return {
        numOfTrip: 1,
        startTime: plan.get('time_start'),
        endTime: plan.get('time_end'),
        numOfDrop: Number(plan.num_of_drop),
        totalVolume: Number(plan.get('total_volume')),
        totalWeight: Number(plan.get('total_weight')),
        totalDistance: Number(plan.get('total_distance')),
        totalETA: Number(plan.get('total_eta')),
      }
    }
  }

  /**
   * Create head sheet detail
   * 
   * @param {XlsxPopulate} detailSheet
   * @returns {XlsxPopulate}
   */
  creatDetailHeadSheet(detailSheet){
    detailSheet.range('A1:J1').style(this.styleCellCommon);
    detailSheet.column('A').width(10);
    detailSheet.column('B').width(10);
    detailSheet.column('C').width(10);
    detailSheet.column('D').width(10);
    detailSheet.column('E').width(10);
    detailSheet.column('F').width(20);
    detailSheet.column('G').width(20);
    detailSheet.column('H').width(12);
    detailSheet.column('I').width(10);
    detailSheet.column('J').width(15);
    detailSheet.cell('A1').value('VehicleID');
    detailSheet.cell('B1').value('Seq');
    detailSheet.cell('C1').value('DropID');
    detailSheet.cell('D1').value('Volume');
    detailSheet.cell('E1').value('Weight');
    detailSheet.cell('F1').value('ArriveTime');
    detailSheet.cell('G1').value('FinishTime');
    detailSheet.cell('H1').value('distance[km]');
    detailSheet.cell('I1').value('eta[min]');
    detailSheet.cell('J1').value('avg_speed[km/hr]');
    return detailSheet;
  }

  /**
   * Create body detail sheet
   * 
   * @param {XlsxPopulate} detailSheet
   * @param {Number} iPlan
   * @param {Model} plan
   * @param {Number} iLeg
   * @param {Model} leg
   * @param {Bool} isEndLeg
   * @returns {XlsxPopulate}
   */
  createBodyDetailSheet(detailSheet, iPlan, plan, iLeg, leg, isEndLeg){
    detailSheet.range('A' + iLeg + ':J' + iLeg).style(this.styleCellCommon);
    if (!isEndLeg) { 
      detailSheet.cell('A' + iLeg).value(plan.get('client_vehicle_id'));
      detailSheet.cell('B' + iLeg).value(leg.get('seq'));
      detailSheet.cell('C' + iLeg).value(leg.get('stop_id'));
      detailSheet.cell('D' + iLeg).value(leg.get('volume'));
      detailSheet.cell('E' + iLeg).value(leg.get('weight'));
      detailSheet.cell('F' + iLeg).value(leg.get('arrive_time')).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
      detailSheet.cell('G' + iLeg).value(leg.get('finish_time')).style({...this.styleCellCommon, numberFormat: 'm/d/yy h:mm'});
      const distanceInKm = Helper.roundOneDigit(leg.distance / 1000);
      detailSheet.cell('H' + iLeg).value(distanceInKm);
      detailSheet.cell('I' + iLeg).value(leg.get('eta'));
      const avgSpeed = Helper.roundOneDigit(distanceInKm / (leg.eta / 60));
      detailSheet.cell('J' + iLeg).value(avgSpeed);
    } else {
      detailSheet.cell('C' + iLeg).value('Total');
      detailSheet.cell('D' + iLeg).value(plan.get('total_volume'));
      detailSheet.cell('E' + iLeg).value(plan.get('total_weight'));
      const totalDistanceInKm = Helper.roundOneDigit(plan.total_distance / 1000);
      detailSheet.cell('H' + iLeg).value(totalDistanceInKm);
      detailSheet.cell('I' + iLeg).value(plan.get('total_eta'));
      const avgSpeed = Helper.roundOneDigit(totalDistanceInKm / (plan.total_eta / 60));
      detailSheet.cell('J' + iLeg).value(avgSpeed);
    }
  }

  /**
   * Create master plan file
   * 
   * @param {JobModel} job
   * @param {StopModel[]} stops
   * @param {VehicleModel[]} vehicles
   * @return {File}
   */
  async createMasterReport(job, stops, vehicles) {
    const elsxMasterPlan = await XlsxPopulate.fromBlankAsync();

    await this.createStopsSheet(elsxMasterPlan, stops, job.id);
    this.createVehiclesSheet(elsxMasterPlan, vehicles);

    const name = 'out-master-plan-' + job.get('user_id') + '-' + job.get('id') + '-' + uuid() +'.xlsx';
    await elsxMasterPlan.toFileAsync('./uploads/' + name);
    const fileInfo = fs.statSync('./uploads/' + name);
    return {
      filename: name,
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      originalname: name,
      size: fileInfo.size,
    };
  }

  /**
   * Create stops sheet
   *
   * @param elsxMasterPlan
   * @param {StopModel[]} stops
   * @param {Number} jobId
   */
  async createStopsSheet(elsxMasterPlan, stops, jobId) {
    elsxMasterPlan.sheet(0).name('stops');
    const stopsSheet = elsxMasterPlan.sheet(0);

    const instructPosition = 1;
    const sideInstructPosition = {
      color_required: 'Q2',
      color_optional: 'Q3',
      text_required: 'R2',
      text_optional: 'R3'
    };
    const headerPosition = 2;
    let bodyPosition = 3;

    this.createStopSheetInstruction(stopsSheet, instructPosition, sideInstructPosition);
    this.createStopsSheetHeader(stopsSheet, headerPosition);

    let stopsHistory = await StopService.getStopsHistory(jobId);

    stops.forEach(stop => {
      let preClientVehicleId = StopService.getPreClientVehicleId(stop.client_stop_id, stopsHistory);
      this.createStopsSheetBody(stopsSheet, stop, bodyPosition, preClientVehicleId);
      bodyPosition++;
    });
  }

  /**
   * Create stops instruction
   *
   * @param stopsSheet
   * @param position
   * @param sideInstructPosition
   */
  createStopSheetInstruction(stopsSheet, position, sideInstructPosition) {
    stopsSheet.range(`A${position}:P${position}`).value([
      [
        'หมายเลขจุดส่ง หรือ ID ของกล่องสินค้า (ห้ามซ้ำ)',
        'ละติจูด ที่อยู่ที่จะจัดส่ง',
        'ลองจิจูด ที่อยู่ที่จะจัดส่ง',
        'ระยะให้บริการ ณ จุดส่ง เช่นต้องประกอบสินค้า หรือ เวลาในการรอคอยผู้รับตรวจรับของ ฯลฯ (นาที)',
        'เวลาเริ่มรับสินค้า',
        'เวลาสิ้นสุดรับสินค้า หรือ จำนวนชั่วโมง',
        'ปริมาตร ของสินค้าที่จะส่งที่จุดนี้',
        'น้ำหนักของสินค้าที่จะส่งที่จุดนี้',
        'ไปส่งของ ใส่ 1\nไปรับของใส่ 0\nค่า default คือ 1',
        'ประเภทรถที่สามารถเข้าไปได้\n1:มอเตอร์ไซด์ 2: รถสี่ล้อ 4: รถสี่ล้อ (เน้นถนนใหญ่เป็นหลัก) 8: รถบรรทุก\nกรณีที่มีรถหลายประเภทเข้าได้ให้ใส่เครื่องหมาย | เพิ่มเติมได้เช่น 2|8 จุดนี้รถสี่ล้อและรถบรรทุกเข้าได้\n',
        'ลำดับการส่งในแต่ละกลุ่มหมายเลขรถ',
        'หมายเลขรถที่ใช้ในการจัดส่ง',
        'ชื่อ',
        'ที่อยู่ (ถ้ามี lat/lon แล้ว จะใส่ก็ได้ไม่ใส่ก็ได้)ถ้าไม่มีต้องใส่',
        'เบอร์โทร'
      ],
    ]);

    stopsSheet
      .range(`A${position}:C${position}`)
      .style(this.styleCellInstructionRequired);

    stopsSheet
      .range(`D${position}:P${position}`)
      .style(this.styleCellInstructionOptional);

    // side instruction required
    stopsSheet
      .cell(sideInstructPosition.color_required)
      .style(this.styleCellInstructionRequired);

    stopsSheet
      .cell(sideInstructPosition.text_required)
      .style(this.styleCellCommon)
      .value('บังคับใส่ข้อมูล');

    // side instruction optional
    stopsSheet
      .cell(sideInstructPosition.color_optional)
      .style(this.styleCellInstructionOptional);

    stopsSheet
      .cell(sideInstructPosition.text_optional)
      .style(this.styleCellCommon)
      .value('ไม่บังคับใส่ข้อมูล');

    stopsSheet.row(position).height(100);
  }

  /**
   * Create head in sheet master mode
   *
   * @param {XlsxPopulate} stopsSheet
   * @param position
   * @returns {XlsxPopulate}
   */
  createStopsSheetHeader(stopsSheet, position) {
    stopsSheet.range(`A${position}:P${position}`).value([
      ['stop_id', 'lat', 'lng', 'service_time', 'time_st', 'time_en', 'volume',
        'weight', 'dropoffs', 'type', 'seq', 'vehicle_id', 'name', 'address', 'tel', 'pre_vehicle_id'],
    ]).style(this.styleCellCommon);
    stopsSheet.column('B').width(15);
    stopsSheet.column('C').width(15);
    stopsSheet.column('D').width(15);
    stopsSheet.column('E').width(15);
    stopsSheet.column('P').width(20);
    return stopsSheet;
  }

  /**
   *
   * @param {XlsxPopulate} stopsSheet
   * @param {Model} stop
   * @param {Number} position
   * @param {String} preClientVehicleId
   * @return {XlsxPopulate}
   */
  createStopsSheetBody(stopsSheet, stop, position, preClientVehicleId) {
    stopsSheet.range('A' + position + ':P' + position).style(this.styleCellCommon);
    stopsSheet.cell('A' + position).value(stop.get('client_stop_id'));
    stopsSheet.cell('B' + position).value(stop.get('lat'));
    stopsSheet.cell('C' + position).value(stop.get('lng'));
    stopsSheet.cell('D' + position).value(stop.get('service_time'));
    stopsSheet.cell('E' + position).value(stop.get('time_start'));
    stopsSheet.cell('F' + position).value(stop.get('time_end'));
    stopsSheet.cell('G' + position).value(stop.get('volume'));
    stopsSheet.cell('H' + position).value(stop.get('weight'));
    stopsSheet.cell('I' + position).value(stop.get('dropoffs'));
    stopsSheet.cell('J' + position).value(stop.get('type'));
    stopsSheet.cell('K' + position).value(stop.get('seq'));
    let clientVehicleId = stop.plan ? stop.plan.client_vehicle_id : '';
    stopsSheet.cell('L' + position).value(clientVehicleId);
    stopsSheet.cell('M' + position).value(stop.get('name'));
    stopsSheet.cell('N' + position).value(stop.get('address'));
    stopsSheet.cell('O' + position).value(stop.get('tel'));
    stopsSheet.cell('P' + position).value(preClientVehicleId);

    return stopsSheet;
  }

  /**
   * Create stops sheet
   *
   * @param elsxMasterPlan
   * @param vehicles
   */
  createVehiclesSheet(elsxMasterPlan, vehicles) {
    const instructPosition = 1;
    const sideInstructPosition = {
      color_required: 'N2',
      color_optional: 'N3',
      text_required: 'O2',
      text_optional: 'O3'
    };
    const headerPosition = 2;
    let bodyPosition = 3;
    const vehiclesSheet = elsxMasterPlan.addSheet('vehicles');

    this.createVehiclesInstruction(vehiclesSheet, instructPosition, sideInstructPosition);
    this.createVehiclesSheetHeader(vehiclesSheet, headerPosition);
    vehicles.forEach(vehicle => {
      this.createVehiclesSheetBody(vehiclesSheet, vehicle, bodyPosition);
      bodyPosition++;
    });
  }

  /**
   * Create vehicles sheet header
   *
   * @param vehiclesSheet
   * @param {Number} position
   * @return {*}
   */
  createVehiclesSheetHeader(vehiclesSheet, position) {
    vehiclesSheet.range(`A${position}:M${position}`).value([
      ['vehicle_id', 'lat_st', 'lng_st', 'lat_en', 'lng_en', 'time_st', 'time_en',
        'speed_limit', 'break_time_st', 'break_time_en', 'volume', 'weight', 'type'],
    ]).style(this.styleCellCommon);

    return vehiclesSheet;
  }

  /**
   * Create vehicles sheet
   *
   * @param vehiclesSheet
   * @param {VehicleModel} vehicle
   * @param {Number} position
   */
  createVehiclesSheetBody(vehiclesSheet, vehicle, position) {
    vehiclesSheet.range('A' + position + ':M' + position).style(this.styleCellCommon);
    vehiclesSheet.cell('A' + position).value(vehicle.client_vehicle_id);
    vehiclesSheet.cell('B' + position).value(vehicle.lat_start);
    vehiclesSheet.cell('C' + position).value(vehicle.lng_start);
    vehiclesSheet.cell('D' + position).value(vehicle.lat_end);
    vehiclesSheet.cell('E' + position).value(vehicle.lng_end);
    vehiclesSheet.cell('F' + position).value(vehicle.time_start);
    vehiclesSheet.cell('G' + position).value(vehicle.time_end);
    vehiclesSheet.cell('H' + position).value(vehicle.speed_limit);
    vehiclesSheet.cell('I' + position).value(vehicle.break_time_start);
    vehiclesSheet.cell('J' + position).value(vehicle.break_time_end);
    vehiclesSheet.cell('K' + position).value(vehicle.volume);
    vehiclesSheet.cell('L' + position).value(vehicle.weight);
    vehiclesSheet.cell('M' + position).value(vehicle.type);

    return vehiclesSheet;
  }

  /**
   * Create vehicles instruction
   *
   * @param vehiclesSheet
   * @param position
   * @param sideInstructPosition
   */
  createVehiclesInstruction(vehiclesSheet, position, sideInstructPosition) {
    vehiclesSheet.range(`A${position}:M${position}`).value([
      [
        'รหัสรถ (ห้ามซ้ำ)',
        'ละติจูดของ \nจุดจอดรถ ตอนเริ่มต้น',
        'ลองติจูดของจุดจอดรถตอนเริ่มต้น\n',
        'ละติจูดของ  จุดจอดรถ ตอนจบงาน  (กรณีส่งดร็อปสุดท้ายแล้วจบงาน ให้เว้นว่างไว้)',
        'ลองติจูดของจุดจอดรถ ตอนจบงาน (กรณีส่งดร็อปสุดท้ายแล้วจบงาน ให้เว้นว่างไว้)',
        'เวลาเริ่มต้นทำงานของรถและคนขับ',
        'เวลาจบงานของรถและคนขับ',
        'ความเร็วที่รถห้ามขับเกิน',
        'เวลาเริ่มต้นพักของคนขับรถ',
        'เวลาเริ่มจบการพักของคนขับรถ',
        'ปริมาตรบรรทุกสูงสุดของรถ',
        'น้ำหนักบรรทุกสูงสุดของรถ',
        'ประเภทรถ 1:มอเตอร์ไซด์ 2: รถสี่ล้อ 4: รถสี่ล้อ (เน้นถนนใหญ่เป็นหลัก) 8: รถบรรทุก'
      ],
    ]);

    vehiclesSheet
      .range(`A${position}:C${position}`)
      .style(this.styleCellInstructionRequired);

    vehiclesSheet
      .range(`D${position}:M${position}`)
      .style(this.styleCellInstructionOptional);

    // side instruction required
    vehiclesSheet
      .cell(sideInstructPosition.color_required)
      .style(this.styleCellInstructionRequired);

    vehiclesSheet
      .cell(sideInstructPosition.text_required)
      .style(this.styleCellCommon)
      .value('บังคับใส่ข้อมูล');

    // side instruction optional
    vehiclesSheet
      .cell(sideInstructPosition.color_optional)
      .style(this.styleCellInstructionOptional);

    vehiclesSheet
      .cell(sideInstructPosition.text_optional)
      .style(this.styleCellCommon)
      .value('ไม่บังคับใส่ข้อมูล');

    vehiclesSheet.row(position).height(100);
  }

}
