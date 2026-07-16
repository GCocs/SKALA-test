// HTML 요소 가져오기
const carForm = document.querySelector('#carForm')
const makerInput = document.querySelector('#makerInput')
const modelInput = document.querySelector('#modelInput')
const yearInput = document.querySelector('#yearInput')
const mileageInput = document.querySelector('#mileageInput')
const priceInput = document.querySelector('#priceInput')
const fuelInput = document.querySelector('#fuelInput')
const statusInput = document.querySelector('#statusInput')

const submitButton = document.querySelector('#submitButton')
const cancelEditButton = document.querySelector('#cancelEditButton')
const searchInput = document.querySelector('#searchInput')
const statusFilter = document.querySelector('#statusFilter')

const countText = document.querySelector('#countText')
const emptyMessage = document.querySelector('#emptyMessage')
const carList = document.querySelector('#carList')

// 차량 목록 배열이다. 차량 1대는 객체 1개로 저장한다.
let cars = [
  {
    id: 1,
    maker: '현대',
    model: '쏘나타',
    year: 2021,
    mileage: 43000,
    price: 1850,
    fuel: 'LPG',
    status: '판매중',
  },
  {
    id: 2,
    maker: '기아',
    model: 'K5',
    year: 2020,
    mileage: 52000,
    price: 1690,
    fuel: '가솔린',
    status: '예약중',
  },
]

// null이면 등록 모드, 숫자가 들어 있으면 수정 모드이다.
let editingId = null

// 처음 화면을 열었을 때 차량 목록을 출력한다.
renderCars()

// 차량 목록을 출력
function renderCars() {
  const filteredCars = getFilteredCars()

  // 기존 목록을 비운 뒤 현재 데이터 기준으로 다시 출력한다.
  carList.innerHTML = ''

  emptyMessage.hidden = filteredCars.length > 0
  countText.textContent = `전체 ${cars.length}대 / 표시 ${filteredCars.length}대`

  filteredCars.forEach(function (car) {
    const card = createCarCard(car)
    carList.appendChild(card)
  })
}
// 차량 목록을 필터링
function getFilteredCars() {
  const keyword = searchInput.value.trim().toLowerCase()
  const selectedStatus = statusFilter.value

  return cars.filter(function (car) {
    const searchText = `${car.maker} ${car.model}`.toLowerCase()
    const matchKeyword = searchText.includes(keyword)
    const matchStatus =
      selectedStatus === '전체' || car.status === selectedStatus

    return matchKeyword && matchStatus
  })
}
// 차량 카드 생성
function createCarCard(car) {
  const card = document.createElement('article')
  card.className = 'car-card'

  const title = document.createElement('h3')
  title.textContent = `${car.maker} ${car.model}`

  const info = document.createElement('p')
  info.textContent = `${car.year}년식 · ${car.fuel} · ${car.mileage.toLocaleString()}km`

  const price = document.createElement('p')
  price.className = 'price'
  price.textContent = `${car.price.toLocaleString()}만원`

  const status = document.createElement('span')
  status.className = `status-badge ${getStatusClass(car.status)}`
  status.textContent = car.status

  const actions = document.createElement('div')
  actions.className = 'card-actions'

  const editButton = document.createElement('button')
  editButton.type = 'button'
  editButton.dataset.action = 'edit'
  editButton.dataset.id = car.id
  editButton.textContent = '수정'

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'delete-button'
  deleteButton.dataset.action = 'delete'
  deleteButton.dataset.id = car.id
  deleteButton.textContent = '삭제'

  actions.appendChild(editButton)
  actions.appendChild(deleteButton)

  card.appendChild(title)
  card.appendChild(info)
  card.appendChild(price)
  card.appendChild(status)
  card.appendChild(actions)

  return card
}

// 입력 폼을 리셋
function resetForm() {
  editingId = null
  carForm.reset()
  submitButton.textContent = '등록'
  cancelEditButton.hidden = true
  modelInput.focus()
}

// 차량 상태 정보 설정
function getStatusClass(status) {
  if (status === '판매중') {
    return 'selling'
  }

  if (status === '예약중') {
    return 'reserved'
  }

  return 'sold'
}

// 차량 등록 또는 수정 처리
carForm.addEventListener('submit', function (event) {
  // TODO: [차량 등록 / 수정] 수강생 구현 #1
  // 새로고침 방지
  event.preventDefault()
  // 입력 데이터 가져오기
  const carData = getCarFromForm()

  // 입력 검증
  if (carData === null) {
    return
  }

  // editingId가 null일 경우 신규 등록
  if (editingId === null) {
    const newId =
      cars.length === 0
        ? 1
        : Math.max(...cars.map(function (car) {
            return car.id
          })) + 1

    const newCar = {
      id: newId,
      ...carData,
    }

    cars.push(newCar)
  } else {
    // editingId가 있을 경우 정보 수정
    const carIndex = cars.findIndex(function (car) {
      return car.id === editingId
    })

    cars[carIndex] = {
      id: editingId,
      ...carData,
    }
  }

  // 변경된 차량 목록 재출력
  renderCars()

  // 입력 폼 초기화
  resetForm()
})

// 차량 카드 안의 수정, 삭제 버튼 처리
carList.addEventListener('click', function (event) {
  // TODO: [차량 카드 안의 수정 / 삭제 버튼 처리] 수강생 구현 #2
  const button = event.target.closest('button[data-action]')

  // 수정 또는 삭제 버튼이 아닌 다른 carList 영역을 클릭했을 경우 종료
  if (button === null) {
    return
  }

  const action = button.dataset.action
  const id = Number(button.dataset.id)

  // 수정 버튼 클릭
  if (action === 'edit') {
    startEdit(id)
  }

  // 삭제 버튼 클릭
  if (action === 'delete') {
    deleteCar(id)
  }
})

// 검색어를 입력할 때마다 목록을 다시 그린다.
searchInput.addEventListener('input', function () {
  // TODO: [검색어 입력시 목록 재 출력] 수강생 구현 #3
  renderCars()
})

// 판매 상태를 바꿀 때마다 목록을 다시 그린다.
statusFilter.addEventListener('change', function () {
  // TODO: [판매 상태 변경시 목록 재 출력] 수강생 구현 #4
  renderCars()
})

// 수정 취소
cancelEditButton.addEventListener('click', function () {
  // TODO: [수정 취소] 수강생 구현 #5
  resetForm()
})

// 입력폼에서 차량 정보 가져와서 객체로 반환
function getCarFromForm() {
  const maker = makerInput.value
  const model = modelInput.value.trim()
  const yearText = yearInput.value.trim()
  const mileageText = mileageInput.value.trim()
  const priceText = priceInput.value.trim()
  const fuel = fuelInput.value
  const status = statusInput.value

  const year = Number(yearText)
  const mileage = Number(mileageText)
  const price = Number(priceText)
  const maxYear = new Date().getFullYear()

  //TODO: [입력 정보 검증 및 차량 객체 반환] 수강생 구현 #6
  // 제조사 검사
  if (maker === '') {
    alert('제조사를 선택하세요.')
    makerInput.focus()
    return null
  }

  // 모델명 검사
  if (model === '') {
    alert('모델명을 입력하세요.')
    modelInput.focus()
    return null
  }

  // 연식 검사
  if (
    yearText === '' ||
    !Number.isInteger(year) ||
    year < 1990 ||
    year > maxYear
  ) {
    alert(`연식은 1990년부터 ${maxYear}년 사이로 입력해 주세요.`)
    yearInput.focus()
    return null
  }

  // 가격 검사
  if (
    priceText === '' ||
    !Number.isInteger(price) ||
    price < 1
  ) {
    alert('가격은 1이상 입력하세요.')
    priceInput.focus()
    return null
  }

  // 주행거리 검사
  if (
    mileageText === '' ||
    !Number.isInteger(mileage) ||
    mileage < 0
  ) {
    alert('주행거리는 0이상 입력하세요.')
    mileageInput.focus()
    return null
  }

  // 연료 검사
  if (fuel === '') {
    alert('연료를 선택하세요.')
    fuelInput.focus()
    return null
  }

  // 검증을 통과한 차량 객체 반환
  return {
    maker,
    model,
    year,
    mileage,
    price,
    fuel,
    status
  }
}

// 차량 정보 수정 설정
function startEdit(id) {
  //TODO: [차량 정보 수정 설정] 수강생 구현 #7
  const selectedCar = cars.find(function (car) {
    return car.id === id
  })

  // 수정할 차량 id 저장
  editingId = id

  // 차량 정보를 입력 폼에 삽입
  makerInput.value = selectedCar.maker
  modelInput.value = selectedCar.model
  yearInput.value = selectedCar.year
  mileageInput.value = selectedCar.mileage
  priceInput.value = selectedCar.price
  fuelInput.value = selectedCar.fuel
  statusInput.value = selectedCar.status

  // 버튼을 수정 상태로 변경
  submitButton.textContent = '수정 완료'
  cancelEditButton.hidden = false
}

// 차량 정보 삭제
function deleteCar(id) {
  // TODO: [차량 정보 삭제] 수강생 구현 #8
  // 삭제할 차량을 확인
  const selectedCar = cars.find(function (car) {
    return car.id === id
  })

  const isConfirmed = confirm(
    `선택한 차량을 삭제할까요?`
  )

  // 취소를 누를시 즉시 종료
  if (!isConfirmed) {
    return
  }

  // 선택한 차량을 제외한 새로운 배열을 생성
  cars = cars.filter(function (car) {
    return car.id !== id
  })

  // 수정 중인 차량을 삭제했다면 폼 초기화
  if (editingId === id) {
    resetForm()
  }

  // 변경된 목록을 재출력
  renderCars()
}
