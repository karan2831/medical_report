/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reports/route";
exports.ids = ["app/api/reports/route"];
exports.modules = {

/***/ "(rsc)/./app/api/reports/route.js":
/*!**********************************!*\
  !*** ./app/api/reports/route.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/index.mjs\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_audit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/audit */ \"(rsc)/./lib/audit.js\");\n\n\n\nasync function GET(request) {\n    try {\n        const supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2__.createClient)(\"https://aatnogpmsiktvxupzzgb.supabase.co\", \"sb_publishable_BN1SVDeYqVCQWaR4ZZIjVg_ZdNM_mO_\");\n        // 1. Get session user - Phase 8 Strict Enforcement\n        const { data: { user }, error: authError } = await supabase.auth.getUser(request.headers.get('Authorization')?.split(' ')[1]);\n        if (authError || !user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized Access: Clinical Session Required.'\n            }, {\n                status: 401\n            });\n        }\n        // 2. Fetch authenticated reports with extracted insights\n        const { data: reports, error } = await supabase.from('reports').select('*, extracted_data(*)').eq('user_id', user.id).order('created_at', {\n            ascending: false\n        });\n        if (error) throw error;\n        // Phase 8: Clinical Audit\n        await (0,_lib_audit__WEBPACK_IMPORTED_MODULE_1__.logClinicalAction)(user.id, 'view_reports');\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            count: reports.length,\n            reports\n        });\n    } catch (error) {\n        console.error(\"API Reports Sync Error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3JlcG9ydHMvcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFxRDtBQUNWO0FBQ0s7QUFFekMsZUFBZUcsSUFBSUMsT0FBTztJQUMvQixJQUFJO1FBQ0YsTUFBTUMsV0FBV0wsbUVBQVlBLENBQzNCTSwwQ0FBb0MsRUFDcENBLGdEQUF5QztRQUczQyxtREFBbUQ7UUFDbkQsTUFBTSxFQUFFSSxNQUFNLEVBQUVDLElBQUksRUFBRSxFQUFFQyxPQUFPQyxTQUFTLEVBQUUsR0FBRyxNQUFNUixTQUFTUyxJQUFJLENBQUNDLE9BQU8sQ0FDdEVYLFFBQVFZLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQkMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUdyRCxJQUFJTCxhQUFhLENBQUNGLE1BQU07WUFDdEIsT0FBT1YscURBQVlBLENBQUNrQixJQUFJLENBQUM7Z0JBQUVQLE9BQU87WUFBa0QsR0FBRztnQkFBRVEsUUFBUTtZQUFJO1FBQ3ZHO1FBRUEseURBQXlEO1FBQ3pELE1BQU0sRUFBRVYsTUFBTVcsT0FBTyxFQUFFVCxLQUFLLEVBQUUsR0FBRyxNQUFNUCxTQUNwQ2lCLElBQUksQ0FBQyxXQUNMQyxNQUFNLENBQUMsd0JBQ1BDLEVBQUUsQ0FBQyxXQUFXYixLQUFLYyxFQUFFLEVBQ3JCQyxLQUFLLENBQUMsY0FBYztZQUFFQyxXQUFXO1FBQU07UUFFMUMsSUFBSWYsT0FBTyxNQUFNQTtRQUVqQiwwQkFBMEI7UUFDMUIsTUFBTVYsNkRBQWlCQSxDQUFDUyxLQUFLYyxFQUFFLEVBQUU7UUFFakMsT0FBT3hCLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUFDO1lBQ3ZCUyxTQUFTO1lBQ1RDLE9BQU9SLFFBQVFTLE1BQU07WUFDckJUO1FBQ0Y7SUFDRixFQUFFLE9BQU9ULE9BQU87UUFDZG1CLFFBQVFuQixLQUFLLENBQUMsMkJBQTJCQTtRQUN6QyxPQUFPWCxxREFBWUEsQ0FBQ2tCLElBQUksQ0FBQztZQUFFUyxTQUFTO1lBQU9oQixPQUFPQSxNQUFNb0IsT0FBTztRQUFDLEdBQUc7WUFBRVosUUFBUTtRQUFJO0lBQ25GO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYm9kaGdcXERlc2t0b3BcXG1lZGljYWwgcmVwb3J0XFxhcHBcXGFwaVxccmVwb3J0c1xccm91dGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGxvZ0NsaW5pY2FsQWN0aW9uIH0gZnJvbSAnQC9saWIvYXVkaXQnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcbiAgICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCxcbiAgICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZXG4gICAgKTtcblxuICAgIC8vIDEuIEdldCBzZXNzaW9uIHVzZXIgLSBQaGFzZSA4IFN0cmljdCBFbmZvcmNlbWVudFxuICAgIGNvbnN0IHsgZGF0YTogeyB1c2VyIH0sIGVycm9yOiBhdXRoRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcihcbiAgICAgIHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKT8uc3BsaXQoJyAnKVsxXVxuICAgICk7XG5cbiAgICBpZiAoYXV0aEVycm9yIHx8ICF1c2VyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCBBY2Nlc3M6IENsaW5pY2FsIFNlc3Npb24gUmVxdWlyZWQuJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIC8vIDIuIEZldGNoIGF1dGhlbnRpY2F0ZWQgcmVwb3J0cyB3aXRoIGV4dHJhY3RlZCBpbnNpZ2h0c1xuICAgIGNvbnN0IHsgZGF0YTogcmVwb3J0cywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgncmVwb3J0cycpXG4gICAgICAuc2VsZWN0KCcqLCBleHRyYWN0ZWRfZGF0YSgqKScpXG4gICAgICAuZXEoJ3VzZXJfaWQnLCB1c2VyLmlkKVxuICAgICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuXG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcblxuICAgIC8vIFBoYXNlIDg6IENsaW5pY2FsIEF1ZGl0XG4gICAgYXdhaXQgbG9nQ2xpbmljYWxBY3Rpb24odXNlci5pZCwgJ3ZpZXdfcmVwb3J0cycpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgXG4gICAgICBzdWNjZXNzOiB0cnVlLCBcbiAgICAgIGNvdW50OiByZXBvcnRzLmxlbmd0aCxcbiAgICAgIHJlcG9ydHMgXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkFQSSBSZXBvcnRzIFN5bmMgRXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsIk5leHRSZXNwb25zZSIsImxvZ0NsaW5pY2FsQWN0aW9uIiwiR0VUIiwicmVxdWVzdCIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiZGF0YSIsInVzZXIiLCJlcnJvciIsImF1dGhFcnJvciIsImF1dGgiLCJnZXRVc2VyIiwiaGVhZGVycyIsImdldCIsInNwbGl0IiwianNvbiIsInN0YXR1cyIsInJlcG9ydHMiLCJmcm9tIiwic2VsZWN0IiwiZXEiLCJpZCIsIm9yZGVyIiwiYXNjZW5kaW5nIiwic3VjY2VzcyIsImNvdW50IiwibGVuZ3RoIiwiY29uc29sZSIsIm1lc3NhZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/reports/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/audit.js":
/*!**********************!*\
  !*** ./lib/audit.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logClinicalAction: () => (/* binding */ logClinicalAction)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/index.mjs\");\n\n/**\n * MedAI Clinical Audit Logger\n * Logs clinical actions to the public.audit_logs table.\n */ async function logClinicalAction(userId, action, targetId = null) {\n    try {\n        const supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(\"https://aatnogpmsiktvxupzzgb.supabase.co\", \"sb_publishable_BN1SVDeYqVCQWaR4ZZIjVg_ZdNM_mO_\");\n        const { error } = await supabase.from('audit_logs').insert([\n            {\n                user_id: userId,\n                action,\n                target_id: targetId,\n                timestamp: new Date().toISOString()\n            }\n        ]);\n        if (error) {\n            console.error(\"Clinical Audit Logging Failed:\", error.message);\n        }\n    } catch (error) {\n        console.error(\"Audit System Exception:\", error.message);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXVkaXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBcUQ7QUFFckQ7OztDQUdDLEdBQ00sZUFBZUMsa0JBQWtCQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsV0FBVyxJQUFJO0lBQ3JFLElBQUk7UUFDRixNQUFNQyxXQUFXTCxtRUFBWUEsQ0FDM0JNLDBDQUFvQyxFQUNwQ0EsZ0RBQXlDO1FBRzNDLE1BQU0sRUFBRUksS0FBSyxFQUFFLEdBQUcsTUFBTUwsU0FDckJNLElBQUksQ0FBQyxjQUNMQyxNQUFNLENBQUM7WUFDTjtnQkFDRUMsU0FBU1g7Z0JBQ1RDO2dCQUNBVyxXQUFXVjtnQkFDWFcsV0FBVyxJQUFJQyxPQUFPQyxXQUFXO1lBQ25DO1NBQ0Q7UUFFSCxJQUFJUCxPQUFPO1lBQ1RRLFFBQVFSLEtBQUssQ0FBQyxrQ0FBa0NBLE1BQU1TLE9BQU87UUFDL0Q7SUFDRixFQUFFLE9BQU9ULE9BQU87UUFDZFEsUUFBUVIsS0FBSyxDQUFDLDJCQUEyQkEsTUFBTVMsT0FBTztJQUN4RDtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGJvZGhnXFxEZXNrdG9wXFxtZWRpY2FsIHJlcG9ydFxcbGliXFxhdWRpdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuXG4vKipcbiAqIE1lZEFJIENsaW5pY2FsIEF1ZGl0IExvZ2dlclxuICogTG9ncyBjbGluaWNhbCBhY3Rpb25zIHRvIHRoZSBwdWJsaWMuYXVkaXRfbG9ncyB0YWJsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ0NsaW5pY2FsQWN0aW9uKHVzZXJJZCwgYWN0aW9uLCB0YXJnZXRJZCA9IG51bGwpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcbiAgICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCxcbiAgICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZXG4gICAgKTtcblxuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgnYXVkaXRfbG9ncycpXG4gICAgICAuaW5zZXJ0KFtcbiAgICAgICAge1xuICAgICAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgdGFyZ2V0X2lkOiB0YXJnZXRJZCxcbiAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNsaW5pY2FsIEF1ZGl0IExvZ2dpbmcgRmFpbGVkOlwiLCBlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkF1ZGl0IFN5c3RlbSBFeGNlcHRpb246XCIsIGVycm9yLm1lc3NhZ2UpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwibG9nQ2xpbmljYWxBY3Rpb24iLCJ1c2VySWQiLCJhY3Rpb24iLCJ0YXJnZXRJZCIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiZXJyb3IiLCJmcm9tIiwiaW5zZXJ0IiwidXNlcl9pZCIsInRhcmdldF9pZCIsInRpbWVzdGFtcCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImNvbnNvbGUiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/audit.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.js&appDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.js&appDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_bodhg_Desktop_medical_report_app_api_reports_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/reports/route.js */ \"(rsc)/./app/api/reports/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reports/route\",\n        pathname: \"/api/reports\",\n        filename: \"route\",\n        bundlePath: \"app/api/reports/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\bodhg\\\\Desktop\\\\medical report\\\\app\\\\api\\\\reports\\\\route.js\",\n    nextConfigOutput,\n    userland: C_Users_bodhg_Desktop_medical_report_app_api_reports_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZXBvcnRzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZyZXBvcnRzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcmVwb3J0cyUyRnJvdXRlLmpzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNib2RoZyU1Q0Rlc2t0b3AlNUNtZWRpY2FsJTIwcmVwb3J0JTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNib2RoZyU1Q0Rlc2t0b3AlNUNtZWRpY2FsJTIwcmVwb3J0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNzQjtBQUNuRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcYm9kaGdcXFxcRGVza3RvcFxcXFxtZWRpY2FsIHJlcG9ydFxcXFxhcHBcXFxcYXBpXFxcXHJlcG9ydHNcXFxccm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3JlcG9ydHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9yZXBvcnRzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9yZXBvcnRzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcYm9kaGdcXFxcRGVza3RvcFxcXFxtZWRpY2FsIHJlcG9ydFxcXFxhcHBcXFxcYXBpXFxcXHJlcG9ydHNcXFxccm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.js&appDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tslib","vendor-chunks/iceberg-js"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.js&appDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cbodhg%5CDesktop%5Cmedical%20report&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();