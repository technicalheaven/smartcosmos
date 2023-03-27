import { config } from "../../../config"

export const DEFAULT_PASSWORD = 'SmartCosmos@1234'
export const STATUS = 'invited' 
export const EMAIL = `<html><head><title>Welcome to SmartCosmos</title></head><body> <h1>Welcome to SmartCosmos </h1><p>You have been invited to access the Smart Cosmos's Platform. Please <a href="{{link}}" style="text-decoration: none;">click here</a> to access the platform.</p> </br><p>Thank you, </p> <p> SmartCosmos Team</p> <p> P.S. Responses to this email are not monitored.</p></body></html>`
export const SUBJECT ='Invitation'
export const PLAINTEXT = "Welcome to SmartCosmos\n\n This email is part of testing of email communication service. \\n Best wishes"
export const TIMEOUT = 5000
export const SCOPE = 'openid offline_access'
export const grant_type = 'password'
export const grant_type_refresh = 'refresh_token'
export const microsoft_route = `https://login.microsoftonline.com/${config.TENANT_ID}/oauth2/v2.0/token`
export const SUPER_ADMIN = 'Platform Super Admin' 
export const FORGOTSUBJECT = 'Forgot Password' 
export const inactive = 'inactive' 
export const InActive = 'Inactive' 
export const OperatorRole = 'Operator' 
export const active = 'active'
export const invited = 'invited'
export const grant_type_token = 'refresh_token'