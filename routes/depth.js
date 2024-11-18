const express = require('express');
const Depth = require('../models/depth');
const Employee = require('../models/employee');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { deptNo, deptName, cellNo, deptCheck } = req.body;

    if (!deptNo || !deptName || deptCheck === undefined) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const newDept = await Depth.create({
      deptNo,
      deptName,
      cellNo,
      deptCheck: deptCheck ? 1 : 0
    });
    res.status(201).json(newDept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const depths = await Depth.findAll();
    res.status(200).json(depths); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch department data' });
  }
});
const { sequelize } = require('../models');

router.delete('/:id', async (req, res) => {
  const deptId = req.params.id;
  console.log('부서 삭제 요청, deptNo:', deptId);  // 요청 받은 deptId 확인

  try {
    // 부서 존재 여부 확인
    const dept = await Depth.findOne({ where: { deptNo: deptId } });
    if (!dept) {
      console.log('부서 없음');
      return res.status(404).json({ error: 'Department not found' });
    }

    // 해당 부서에 사원이 있는지 확인
    const employees = await Employee.findAll({ where: { deptNo: deptId } });
    if (employees.length > 0) {
      console.log('부서에 사원이 존재');
      return res.status(400).json({ error: 'Cannot delete department with employees' });
    }

    // 부서 삭제
    await dept.destroy();
    console.log('부서 삭제 완료');
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});


router.get('/:id/employee', async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { deptNo: req.params.id },
    });
    res.json(employees);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
