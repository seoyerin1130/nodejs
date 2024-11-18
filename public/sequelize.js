document.querySelectorAll('#depth-list tr').forEach((el) => {
    el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        getEmployee(id);
    });
});

async function getDepth() {
    try {
        const response = await fetch('http://localhost:3000/depth');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const depths = await response.json();
        const tbody = document.querySelector('#depth-list tbody');
        tbody.innerHTML = '';
        depths.forEach(function (depth) {
            const row = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = depth.deptNo; // 부서번호
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = depth.deptName; // 부서명
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = depth.cellNo; // 전화번호
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = depth.deptCheck ? 'O' : 'X'; // 영업 여부
            row.appendChild(td);

            // 삭제 버튼 생성
            td = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', async () => {
                if (confirm('정말 삭제하시겠습니까?')) {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/depth/${depth.deptNo}`, {
                            method: 'DELETE',
                        });
                        if (!deleteResponse.ok) {
                            throw new Error('Network response was not ok');
                        }
                        getDepth();
                    } catch (err) {
                        console.error(err);
                        alert('삭제 중 오류가 발생했습니다.');
                    }
                }
            });
            td.appendChild(deleteButton);
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}


async function getEmployee(depth_no) {
    try {
        const response = await fetch(`/depth/${depth_no}/employee`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const employees = await response.json();
        const tbody = document.querySelector('#employee-list tbody');
        tbody.innerHTML = '';
        employees.forEach(function (employee) {
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = employee.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = employee.depth.depth_name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = employee.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = employee.salary;
            row.appendChild(td);

            // 수정 버튼
            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => {
                const newName = prompt('바꿀 이름을 입력하세요');
                if (!newName) {
                    return alert('내용을 반드시 입력하셔야 합니다.');
                }
                try {
                    const response = await fetch(`/employee/${employee.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: newName })
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    getEmployee(depth_no);
                } catch (err) {
                    console.error(err);
                }
            });

            // 삭제 버튼
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/employee/${employee.id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    getEmployee(depth_no);
                } catch (err) {
                    console.error(err);
                }
            });

            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('depth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const depthNo = e.target['depth_no'].value;
    const depthName = e.target['depth_name'].value;
    const cellNo = e.target['cell_no'].value;
    const check = e.target['depth_check'].checked;

    if (!depthNo || !depthName || !cellNo) {
        return alert('모든 필드를 입력하세요.');
    }

    try {
        const response = await fetch('http://localhost:3000/depth', { // 수정된 URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                deptNo: depthNo, 
                deptName: depthName, 
                cellNo: cellNo, 
                deptCheck: check
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        getDepth();
    } catch (err) {
        console.error(err);
    }

    e.target.reset();
});

document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const depthNo = e.target['employee_depth_no'].value;
    const name = e.target['employee_name'].value;
    const salary = e.target['employee_salary'].value;

    if (!depthNo || !name || !salary) {
        return alert('모든 필드를 입력하세요.');
    }

    try {
        const response = await fetch(`/depth/${depthNo}/employee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, salary })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        getEmployee(depthNo);
    } catch (err) {
        console.error(err);
    }

    e.target.reset();
});

getDepth()