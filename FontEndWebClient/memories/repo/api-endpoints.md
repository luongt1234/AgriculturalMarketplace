# API Endpoints Configuration

## SanPhamDang (Product) Endpoints

### Get User's Products (Seller)
- **Endpoint**: `GET /api/SanPhamDang/user`
- **Require Auth**: Yes (uses User ID from JWT claims)
- **Params**: 
  - `pageNumber` (int, default=1)
  - `pageSize` (int, default=10)
- **Response**: PagedResult with properties: data[], pageNumber, pageSize, totalRecords

### Get All Products (Public)
- **Endpoint**: `GET /api/SanPhamDang/product`
- **Require Auth**: No (AllowAnonymous)
- **Params**:
  - `pageNumber` (int, default=1)
  - `pageSize` (int, default=10)
- **Response**: PagedResult with properties: data[], pageNumber, pageSize, totalRecords

### Create Product
- **Endpoint**: `POST /api/SanPhamDang`
- **Require Auth**: Yes
- **Content-Type**: multipart/form-data
- **Body**: SanPhamDangFormDto with File

### Update Product
- **Endpoint**: `PUT /api/SanPhamDang/{id}`
- **Require Auth**: Yes
- **Content-Type**: multipart/form-data
- **Body**: SanPhamDangFormDto with optional File

### Delete Product
- **Endpoint**: `DELETE /api/SanPhamDang/{id}`
- **Require Auth**: Yes
- **Response**: Success/Error message

## DiaChiNguoiDung (User Address) Endpoints

### Get User's Addresses
- **Endpoint**: `GET /api/DiaChiNguoiDung`
- **Require Auth**: Yes
- **Response**: Array of DiaChiNguoiDungDto

### Get Addresses Paged
- **Endpoint**: `GET /api/DiaChiNguoiDung/paged`
- **Require Auth**: Yes
- **Params**:
  - `pageNumber` (int, default=1)
  - `pageSize` (int, default=10)
- **Response**: PagedResult with DiaChiNguoiDungDto[]

### Get Address by ID
- **Endpoint**: `GET /api/DiaChiNguoiDung/{id}`
- **Require Auth**: Yes
- **Response**: DiaChiNguoiDungDto

### Create Address
- **Endpoint**: `POST /api/DiaChiNguoiDung`
- **Require Auth**: Yes
- **Content-Type**: application/json
- **Body**: DiaChiNguoiDungFormDto

### Update Address
- **Endpoint**: `PUT /api/DiaChiNguoiDung/{id}`
- **Require Auth**: Yes
- **Content-Type**: application/json
- **Body**: DiaChiNguoiDungFormDto

### Delete Address
- **Endpoint**: `DELETE /api/DiaChiNguoiDung/{id}`
- **Require Auth**: Yes
- **Response**: Success message

## Notes
- Frontend API functions currently do NOT support search/filter at API level
- Frontend uses pageNumber (1-based) matching backend response
- Response follows: { success, message, data{...}, errors }