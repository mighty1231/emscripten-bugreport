#include <iostream>

#ifdef USE_UNORDER
#include <unordered_map>
#else
#include <map>
#endif

#ifdef USE_UNORDER
std::unordered_map<std::string, std::pair<bool, bool>>
#else
std::map<std::string, std::pair<bool, bool>>
#endif
NameToArgUsageMap{
#ifdef DATA_10
    {"relu", {false, false}},
    {"leakyrelu", {true, false}},
    {"thresholdedrelu", {true, false}},
    {"tanh", {false, false}},
    {"scaledtanh", {true, true}},
    {"sigmoid", {false, false}},
    {"hardsigmoid", {true, true}},
    {"elu", {true, false}},
    {"softsign", {false, false}},
    {"softplus", {false, false}}};
#endif
#ifdef DATA_1
    {"relu", {false, false}}};
#endif
#ifdef DATA_2
    {"relu", {false, false}},
    {"leakyrelu", {true, false}}};
#endif
#ifdef DATA_5
    {"relu", {false, false}},
    {"leakyrelu", {true, false}},
    {"thresholdedrelu", {true, false}},
    {"tanh", {false, false}},
    {"scaledtanh", {true, true}}};
#endif

int main() {
    for (const auto& pair : NameToArgUsageMap) {
        const std::string& key = pair.first;
        const std::pair<bool, bool>& value = pair.second;
        std::cout << key << ": {" << value.first << ", " << value.second << "}" << std::endl;
    }

    return 0;
}
