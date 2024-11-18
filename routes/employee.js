const express = require('express');
const { Employee } = require('../models');

const router = express.Router();

// POST 요청 처리
router.post('/', async (req, res, next) => {
  try {
    const { name, salary, deptNo } = req.body;

    // 데이터 유효성 체크
    if (!name || salary === undefined || !deptNo) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const employee = await Employee.create({ name, salary, deptNo });
    console.log(employee);
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// PATCH 요청 처리
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, salary, deptNo } = req.body;

    const result = await Employee.update(
      { name, salary, deptNo },
      { where: { pNo: req.params.id } } // pNo로 수정
    );

    if (result[0] === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE 요청 처리
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Employee.destroy({
      where: { pNo: req.params.id } // pNo로 수정
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const employees = await Employee.findAll({ where: { deptNo: req.params.id } });
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

module.exports = router;
