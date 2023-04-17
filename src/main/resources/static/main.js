const data = document.getElementById("tableUserBody");
const url = 'http://localhost:8080/api/admin/viewUser';
const panel = document.getElementById("admin-header");

function userAuthInfo() {
    fetch(url)
        .then((res) => res.json())
        .then((user) => {

            let temp = '';

            temp += `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${user.roles.map(role => " " + role.role.substring(5))}</td> 
            </tr>`;
            data.innerHTML = temp;
            panel.innerHTML = `<h5>${user.username} with roles: ${user.roles.map(role => " " + role.role.substring(5))}</h5>`
        });
}

userAuthInfo()


const URL = "/api/admin/users";

$(document).ready(function () {
    getUsers();
})

function getUsers() {
    fetch(URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (users) {
            let placeholder = document.getElementById('data_output');
            let out = "";
            for (let user of users) {
                out += '<tr>';
                out += '<td>' + user.id + '</td>';
                out += '<td>' + user.firstName + '</td>';
                out += '<td>' + user.lastName + '</td>';
                out += '<td>' + user.age + '</td>';
                out += '<td>' + user.username + '</td>';

                let i, role = "";
                for (i in user.roles) {
                    if (user.roles[i].role === "ROLE_USER") {
                        role = "USER";
                    } else {
                        role = "ADMIN";
                    }
                    if (user.roles.length === 1) {
                        out += "<td>" + role + "</td>";
                    } else if (i == 0) {
                        out += "<td>" + role + ", ";
                    } else {
                        out += role + "</td>";
                    }
                }
                out += '<td>' +
                    '<button type="button" class="btn btn-info" data-bs-target="#editModal" data-bs-toggle="modal" ' +
                    'onclick="getEditModal(' + user.id + ')">' + 'Edit' +
                    '</button>' +
                    '</td>';
                out += '<td>' +
                    '<button type="button" class="btn btn-danger" data-bs-target="#deleteModal" data-bs-toggle="modal" ' +
                    'onclick="getDeleteModal(' + user.id + ')">' + 'Delete' +
                    '</button>' +
                    '</td>';
                out += '</tr>';
            }

            placeholder.innerHTML = out;
        });
}

function getEditModal(id) {
    fetch(URL + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json()
            .then(userEdit => {
                document.getElementById('edit_id').value = userEdit.id;
                document.getElementById('edit_firstName').value = userEdit.firstName;
                document.getElementById('edit_lastName').value = userEdit.lastName;
                document.getElementById('edit_age').value = userEdit.age;
                document.getElementById('edit_username').value = userEdit.username;
                document.getElementById('edit_password').value = userEdit.password;
                document.getElementById('edit_role').value = userEdit.roles;

                const select = document.querySelector('#edit_role').getElementsByTagName('option');

                for (let i = 0; i < select.length; i++) {
                    if (select[i].value === userEdit.roles[i].role) {
                        select[i].selected = true;
                        if (i === select.length - 1) {
                            break;
                        }
                    } else if (select[i + 1].value === userEdit.roles[i].role) {
                        select[i + 1].selected = true;
                    }
                }
            })
    });
}

function editUser() {
    event.preventDefault();
    let id = document.getElementById('edit_id').value;
    let firstName = document.getElementById('edit_firstName').value;
    let lastName = document.getElementById('edit_lastName').value;
    let age = document.getElementById('edit_age').value;
    let username = document.getElementById('edit_username').value;
    let password = document.getElementById('edit_password').value;
    let roles = $("#edit_role").val()

    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ROLE_ADMIN') {
            roles[i] = {
                'id': 2,
                'role': 'ROLE_ADMIN',
                "authority": "ROLE_ADMIN"
            }
        }
        if (roles[i] === 'ROLE_USER') {
            roles[i] = {
                'id': 1,
                'role': 'ROLE_USER',
                "authority": "ROLE_USER"
            }
        }
    }

    fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            'id': id,
            'firstName': firstName,
            'lastName': lastName,
            'age': age,
            'username': username,
            'password': password,
            'roles': roles
        })
    })
        .then(() => {
            $('#editModal').modal('hide');
            getUsers();
        })
}

function getDeleteModal(id) {
    fetch(URL + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(userDelete => {
            document.getElementById('delete_id').value = userDelete.id;
            document.getElementById('delete_username').value = userDelete.firstName;
            document.getElementById('delete_surname').value = userDelete.lastName;
            document.getElementById('delete_age').value = userDelete.age;
            document.getElementById('delete_job').value = userDelete.username;
            document.getElementById('delete_password').value = userDelete.password;
            document.getElementById('delete_role').value = userDelete.roles;
        })
    });
}

function deleteUser() {
    event.preventDefault();
    let id = document.getElementById('delete_id').value;

    fetch(URL + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },

    })
        .then(() => {
            $('#deleteModal').modal('hide');
            getUsers();
        })
}

function addUser() {
    event.preventDefault();
    let firstName = document.getElementById('create_username').value;
    let lastName = document.getElementById('create_surname').value;
    let age = document.getElementById('create_age').value;
    let username = document.getElementById('create_job').value;
    let password = document.getElementById('create_password').value;
    let roles = $("#create_role").val()


    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            'firstName': firstName,
            'lastName': lastName,
            'age': age,
            'username': username,
            'password': password,
            'roles': roles
        })
    })
        .then(() => {
            document.getElementById('nav-users_table-tab').click()
            getUsers()
            document.newUserForm.reset()
        })

}





