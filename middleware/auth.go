package middleware

import (
	"a21hc3NpZ25tZW50/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func Auth() gin.HandlerFunc {
	return gin.HandlerFunc(func(ctx *gin.Context) {
		ctx.Set("authenticated", "false")

		tokenStr, err := ctx.Cookie("session_token")
		if err != nil {
			ctx.Redirect(http.StatusSeeOther, "/client/login")
			return
		}

		var claims model.Claims
		token, err := jwt.ParseWithClaims(tokenStr, &claims, func(t *jwt.Token) (interface{}, error) {
			return model.JwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				ctx.AbortWithStatus(http.StatusUnauthorized)
			} else {
				ctx.AbortWithStatus(http.StatusBadRequest)
			}

			return
		}

		if !token.Valid {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			// ctx.Redirect(http.StatusSeeOther, "/client/login")
			return
		}

		ctx.Set("authenticated", "true")
		ctx.Next()
	})
}
