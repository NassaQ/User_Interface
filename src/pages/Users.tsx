// ================================
// 🌍 TRANSLATION: Users Page
// Namespace: pages.users.*
// ================================

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import {
  Mail,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";

type UserStatus = "active" | "inactive";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
};

type TabKey = "all" | "active" | "inactive";

const PAGE_SIZE = 8;

const initialUsers: User[] = [
  {
    id: 1,
    name: "Mr. Laverne Cole",
    email: "Stephany83@yahoo.com",
    role: "Creative",
    status: "active",
  },
  {
    id: 2,
    name: "Irvin Gusikowski",
    email: "Salvador98@yahoo.com",
    role: "Markets",
    status: "active",
  },
  {
    id: 3,
    name: "Ignacio Jerde PhD",
    email: "Baron_Dickinson@yahoo.com",
    role: "Intranet",
    status: "inactive",
  },
  {
    id: 4,
    name: "Lucio Walter",
    email: "Roberto.Zieme@gmail.com",
    role: "Optimization",
    status: "active",
  },
  {
    id: 5,
    name: "Dr. Donnie Bernier",
    email: "Mary81@hotmail.com",
    role: "Response",
    status: "active",
  },
  {
    id: 6,
    name: "Mark Robel II",
    email: "Gregoria53@yahoo.com",
    role: "Integration",
    status: "active",
  },
  {
    id: 7,
    name: "Jean McDermott",
    email: "Forest77@gmail.com",
    role: "Solutions",
    status: "inactive",
  },
  {
    id: 8,
    name: "Cindy Buckeridge",
    email: "Era.Bruen@hotmail.com",
    role: "Accounts",
    status: "active",
  },
  {
    id: 9,
    name: "Samantha Page",
    email: "Jeromy.Braun97@hotmail.com",
    role: "Identity",
    status: "active",
  },
  {
    id: 10,
    name: "Melaine Ernard",
    email: "Frederic77@gmail.com",
    role: "Mobility",
    status: "active",
  },
];

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  activeTab: TabKey;
  onTabChange: (value: TabKey) => void;
  counts: {
    all: number;
    active: number;
    inactive: number;
  };
  availableRoles: string[];
}

interface UsersTableProps {
  users: User[];
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: number, status: UserStatus) => void;
}

const UsersFilters = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  activeTab,
  onTabChange,
  counts,
  availableRoles,
}: UsersFiltersProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("pages.users.search.placeholder")}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-56">
            <Select
              value={selectedRole}
              onValueChange={(value) => onRoleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("pages.users.filters.rolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("pages.users.filters.allRoles")}
                </SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button className="w-full gap-2 sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Mail className="h-4 w-4" />
            {t("pages.users.actions.sendInvitation")}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            {t("pages.users.actions.manageRoles")}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as TabKey)}
        >
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.all")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.active")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.inactive")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.inactive}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            {t("pages.users.summary.total", {
              count: counts.all,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const UsersTable = ({
  users,
  page,
  total,
  pageSize,
  onPageChange,
  onToggleStatus,
}: UsersTableProps) => {
  const { t } = useLanguage();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * pageSize, total);

  const handleChangePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onPageChange(nextPage);
  };

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="hidden w-full sm:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary"
                  aria-label={t("pages.users.table.selectAll")}
                />
              </TableHead>
              <TableHead className="w-14">
                {t("pages.users.table.no")}
              </TableHead>
              <TableHead>{t("pages.users.table.user")}</TableHead>
              <TableHead>{t("pages.users.table.email")}</TableHead>
              <TableHead>{t("pages.users.table.role")}</TableHead>
              <TableHead>{t("pages.users.table.status")}</TableHead>
              <TableHead className="w-32">
                {t("pages.users.table.activate")}
              </TableHead>
              <TableHead className="w-24 text-right">
                {t("pages.users.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const isActive = user.status === "active";
              const initials = user.name
                .split(" ")
                .map((part) => part[0] ?? "")
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <TableRow key={user.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary"
                      aria-label={t("pages.users.table.selectUser", {
                        name: user.name,
                      })}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      variant={isActive ? "secondary" : "destructive"}
                    >
                      <span
                        className={
                          isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {isActive
                          ? t("pages.users.status.active")
                          : t("pages.users.status.inactive")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) =>
                        onToggleStatus(user.id, checked ? "active" : "inactive")
                      }
                      aria-label={
                        isActive
                          ? t("pages.users.aria.deactivateUser", {
                              name: user.name,
                            })
                          : t("pages.users.aria.activateUser", {
                              name: user.name,
                            })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t("pages.users.actions.editUser")}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label={t("pages.users.actions.deleteUser")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 sm:hidden">
        {users.map((user) => {
          const isActive = user.status === "active";
          const initials = user.name
            .split(" ")
            .map((part) => part[0] ?? "")
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={user.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={t("pages.users.table.moreActions")}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {user.role}
                </Badge>
                <Badge
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  variant={isActive ? "secondary" : "destructive"}
                >
                  <span
                    className={
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {isActive
                      ? t("pages.users.status.active")
                      : t("pages.users.status.inactive")}
                  </span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    onToggleStatus(user.id, checked ? "active" : "inactive")
                  }
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t("pages.users.actions.editUser")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    aria-label={t("pages.users.actions.deleteUser")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground sm:flex-row">
        <span>
          {t("pages.users.pagination.summary", {
            start: startIndex,
            end: endIndex,
            total,
          })}
        </span>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(event) => {
                      event.preventDefault();
                      handleChangePage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
};

const Users = () => {
  const { t } = useLanguage();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      if (activeTab === "active" && user.status !== "active") return false;
      if (activeTab === "inactive" && user.status !== "inactive") return false;

      if (selectedRole !== "all" && user.role !== selectedRole) {
        return false;
      }

      if (!term) return true;

      const nameMatch = user.name.toLowerCase().includes(term);
      const emailMatch = user.email.toLowerCase().includes(term);

      return nameMatch || emailMatch;
    });
  }, [users, searchTerm, selectedRole, activeTab]);

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((user) => user.status === "active").length,
      inactive: users.filter((user) => user.status === "inactive").length,
    }),
    [users],
  );

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(start, end);

  const availableRoles = useMemo(
    () =>
      Array.from(new Set(users.map((user) => user.role))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [users],
  );

  const handleToggleStatus = (id: number, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status,
            }
          : user,
      ),
    );
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <DashboardLayout
      title={t("pages.users.title")}
      subtitle={t("pages.users.subtitle")}
    >
      <div className="mx-auto max-w-6xl">
        <UsersFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
          availableRoles={availableRoles}
        />

        <UsersTable
          users={paginatedUsers}
          page={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;

