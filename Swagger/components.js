const { ActivityStatus, CategoryType, AttendanceStatus, RoleCode } = require('../utils/enum');

// ============ SCHEMAS ============

exports.User = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    name: { type: 'string', example: 'Ahmed Mohamed' },
    email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
    role: { type: 'string', enum: Object.values(RoleCode), example: 'USER' },
    profile_image: { type: 'string', example: 'default.jpg' },
    active: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

exports.createUser = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', example: 'Ahmed Mohamed' },
    email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
    password: { type: 'string', format: 'password', example: '12345678' },
    role: { type: 'string', enum: Object.values(RoleCode), example: 'USER' },
    profile_image: { type: 'string', example: 'default.jpg' }
  }
};

exports.updateUser = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Ahmed Mohamed' },
    email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
    profile_image: { type: 'string', example: 'updated.jpg' }
  }
};

exports.Activity = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
    title: { type: 'string', example: 'Local Culture Festival' },
    description: { type: 'string', example: 'Amazing cultural activity description' },
    location: { type: 'string', example: 'Riyadh, Saudi Arabia' },
    map_url: { type: 'string', example: 'https://maps.example.com/location' },
    latitude: { type: 'number', format: 'float', example: 24.7136 },
    longitude: { type: 'number', format: 'float', example: 46.6753 },
    start_date: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' },
    end_date: { type: 'string', format: 'date-time', example: '2024-01-15T18:00:00.000Z' },
    status: { type: 'string', enum: Object.values(ActivityStatus), example: 'UPCOMING' },
    category: { type: 'string', enum: Object.values(CategoryType), example: 'CULTURAL' },
    price: { type: 'string', example: '50.00' },
    capacity: { type: 'integer', example: 100 },
    creator: { type: 'string', example: '507f1f77bcf86cd799439011' },
    created_at: { type: 'string', format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

exports.createActivity = {
  type: 'object',
  required: ['title', 'description', 'location', 'map_url', 'latitude', 'longitude', 'start_date', 'end_date', 'category', 'price', 'capacity'],
  properties: {
    title: { type: 'string', example: 'Local Culture Festival' },
    description: { type: 'string', example: 'Amazing cultural activity description' },
    location: { type: 'string', example: 'Riyadh, Saudi Arabia' },
    map_url: { type: 'string', example: 'https://maps.example.com/location' },
    latitude: { type: 'number', format: 'float', example: 24.7136 },
    longitude: { type: 'number', format: 'float', example: 46.6753 },
    start_date: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' },
    end_date: { type: 'string', format: 'date-time', example: '2024-01-15T18:00:00.000Z' },
    category: { type: 'string', enum: Object.values(CategoryType), example: 'CULTURAL' },
    price: { type: 'string', example: '50.00' },
    capacity: { type: 'integer', example: 100 }
  }
};

exports.updateActivity = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Updated Local Culture Festival' },
    description: { type: 'string', example: 'Updated activity description' },
    location: { type: 'string', example: 'Riyadh, Diplomatic Quarter' },
    map_url: { type: 'string', example: 'https://maps.example.com/new-location' },
    latitude: { type: 'number', format: 'float', example: 24.7236 },
    longitude: { type: 'number', format: 'float', example: 46.6853 },
    start_date: { type: 'string', format: 'date-time', example: '2024-01-20T10:00:00.000Z' },
    end_date: { type: 'string', format: 'date-time', example: '2024-01-20T18:00:00.000Z' },
    status: { type: 'string', enum: Object.values(ActivityStatus), example: 'ONGOING' },
    category: { type: 'string', enum: Object.values(CategoryType), example: 'ART' },
    price: { type: 'string', example: '75.00' },
    capacity: { type: 'integer', example: 150 }
  }
};

exports.Attendance = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
    user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    activity_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
    status: { type: 'string', enum: Object.values(AttendanceStatus), example: 'PRESENT' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

exports.createAttendance = {
  type: 'object',
  required: ['user_id', 'activity_id', 'status'],
  properties: {
    user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    activity_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
    status: { type: 'string', enum: Object.values(AttendanceStatus), example: 'REGISTERED' }
  }
};

exports.updateAttendance = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: Object.values(AttendanceStatus), example: 'PRESENT' }
  }
};

exports.Review = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
    user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    activity_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
    rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
    comment: { type: 'string', example: 'Amazing and fun activity!' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

exports.createReview = {
  type: 'object',
  required: ['user_id', 'activity_id', 'rating'],
  properties: {
    user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    activity_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
    rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
    comment: { type: 'string', example: 'Amazing and fun activity!' }
  }
};

exports.updateReview = {
  type: 'object',
  properties: {
    rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
    comment: { type: 'string', example: 'Good activity but organization can be improved' }
  }
};

// ============ RESPONSES ============

exports.Error = {
  type: 'object',
  properties: { 
    status: { type: 'string', example: 'error' }, 
    message: { type: 'string', example: 'An error occurred' } 
  }
};

exports.DuplicateEmail = {
  description: 'Email already exists',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { status: 'error', message: 'Email already exists' }
    }
  }
};

exports.Unauthorized = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      }
    }
  }
};

exports.Forbidden = {
  description: 'Forbidden',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'You do not have permission to perform this action'
      }
    }
  }
};

exports.NotFound = {
  description: 'Not found',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'Activity not found'
      }
    }
  }
};

// ============ PARAMETERS ============

exports.IdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string'
  },
  description: 'Item ID'
};

exports.PageParameter = {
  name: 'page',
  in: 'query',
  required: false,
  schema: {
    type: 'integer',
    default: 1,
    minimum: 1
  },
  description: 'Page number'
};

exports.LimitParameter = {
  name: 'limit',
  in: 'query',
  required: false,
  schema: {
    type: 'integer',
    default: 10,
    minimum: 1,
    maximum: 100
  },
  description: 'Items per page'
};

exports.CategoryParameter = {
  name: 'category',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
    enum: Object.values(CategoryType)
  },
  description: 'Activity category'
};

exports.StatusParameter = {
  name: 'status',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
    enum: Object.values(ActivityStatus)
  },
  description: 'Activity status'
};

// ============ AUTH RESPONSES ============

exports.LoginSuccess = {
  description: 'Login successful',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  }
};

exports.LogoutSuccess = {
  description: 'Logout successful',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: { type: 'object', example: null }
        }
      }
    }
  }
};

exports.PasswordResetSent = {
  description: 'Password reset token sent',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { 
            type: 'string', 
            example: 'Password reset token sent to email successfully.' 
          },
          data: { type: 'object', example: null }
        }
      }
    }
  }
};

exports.InvalidCredentials = {
  description: 'Invalid email or password',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'Incorrect email or password'
      }
    }
  }
};

exports.MissingCredentials = {
  description: 'Email and password required',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'Please provide email and password!'
      }
    }
  }
};

exports.InvalidToken = {
  description: 'Invalid or expired token',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'Token is invalid or has expired'
      }
    }
  }
};

exports.UserNotFound = {
  description: 'User not found',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'There is no user with that email address.'
      }
    }
  }
};

exports.InvalidCurrentPassword = {
  description: 'Current password is incorrect',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: {
        status: 'error',
        message: 'Your current password is wrong.'
      }
    }
  }
};